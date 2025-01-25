import { S3Client } from "@aws-sdk/client-s3/dist-types/S3Client";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateMetadata } from "./metadata";
import { Metadata } from "./metadata";

import CryptoJS from "crypto-js";
import { MiddlewareStack } from "@aws-sdk/types";
import { HttpRequest } from "@smithy/protocol-http";
import { getAllAlbumNames } from "./album";
import { getAllTagNames } from "./tags";
import { ImageType } from "types/index.d";

export const validImageTypes: Array<ImageType> = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
];

export const checkSettingsValid = async (
  client: S3Client,
  bucketName: string
): Promise<boolean> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1,
    });
    const response = await client.send(command);
    return true;
  } catch (error) {
    console.error("Error checking bucket:", error);
    return false;
  }
};

// 是否存在图片
export const isExistImage = async (
  client: S3Client,
  bucketName: string,
  hash: string
): Promise<boolean> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: hash,
      MaxKeys: 1, // 只需要检查是否存在至少一个对象
    });

    const response = await client.send(command);
    return !!response.Contents && response.Contents.length > 0;
  } catch (error) {
    console.error("Error checking objects with prefix:", error);
    return false;
  }
};

// 列出某个前缀下的所有文件
export const listFilesWithPrefix = async (
  client: S3Client,
  bucketName: string,
  prefix: string
): Promise<Array<string>> => {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });
  const response = await client.send(command);
  const files =
    response.Contents?.map((item) => item.Key).filter(
      (key): key is string => key !== undefined
    ) || []; // 保留完整路径

  // 按照从小到大的顺序排序
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files;
};

// 通过key判断文件是否存在
export const isFileExist = async (
  client: S3Client,
  bucketName: string,
  key: string
): Promise<string | null> => {
  /**
   * 是否存在文件
   */
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    let response = await client.send(command);
    return response.ETag as string;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === "NotFound" ||
        (error as any).$metadata?.httpStatusCode === 404)
    ) {
      console.log(
        `we received an error that the file(${key}) does not exist, so the check(isFileExist) result is false`
      );
      return null;
    } else {
      console.error(
        "we received an unexpected error, but the check(isFileExist) result is wiil still to be false",
        error
      );
      return null;
    }
  }
};

// 删除单个文件
export const deleteFiles = async (
  client: S3Client,
  bucketName: string,
  keys: Array<string>
): Promise<boolean> => {
  /**
   * 删除文件
   */
  try {
    for (let key of keys) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await client.send(command);
    }
    return true;
  } catch (error) {
    console.error("Error deleting files:", error);
    return false;
  }
};

// 删除某个前缀下的所有文件
export const deleteFilesWithPrefix = async (
  client: S3Client,
  bucketName: string,
  prefix: string
): Promise<boolean> => {
  /**
   * 删除某个前缀下的所有文件
   */

  // 应要求删除多项文件时，需要在请求头中添加 Content-MD5 字段
  const contentMd5Middleware = () => (next: any) => async (args: any) => {
    const { request } = args;
    if (HttpRequest.isInstance(request)) {
      // const contentMD5 = md5Digest.toString("base64");
      const md5Digest = CryptoJS.MD5(request.body);
      // 将 MD5 摘要编码为 Base64
      const contentMD5 = CryptoJS.enc.Base64.stringify(md5Digest);
      request.headers["Content-MD5"] = contentMD5;
    }
    return next(args);
  };

  // 添加 Content-MD5 中间件
  const addContentMd5Middleware = (stack: MiddlewareStack<any, any>) => {
    stack.add(contentMd5Middleware(), {
      step: "build",
      tags: ["SET_CONTENT_MD5"],
      name: "contentMd5Middleware",
    });
  };

  // 移除 Content-MD5 中间件
  const removeContentMd5Middleware = (stack: MiddlewareStack<any, any>) => {
    stack.remove("contentMd5Middleware");
  };

  try {
    let continuationToken: string | undefined = undefined;
    let keys: Array<string> = [];

    // 列出所有匹配前缀的文件
    do {
      const listCommand: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });
      const listResponse = await client.send(listCommand);

      listResponse.Contents?.forEach((item) => {
        if (item.Key) {
          keys.push(item.Key);
        }
      });

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    // 批量删除文件
    while (keys.length > 0) {
      const chunk = keys.splice(0, 1000); // 每次最多删除1000个文件

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: chunk.map((key) => ({ Key: key })),
        },
      });

      addContentMd5Middleware(client.middlewareStack);
      await client.send(deleteCommand);
      removeContentMd5Middleware(client.middlewareStack);
    }

    return true;
  } catch (error) {
    console.error("Error deleting files with prefix:", error);
    return false;
  }
};

// 获取图片的元数据
export const getImageMetadata = async (
  client: S3Client,
  bucketName: string,
  hash: string
): Promise<Metadata> => {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: hash,
      MaxKeys: 1, // 只需要检查是否存在至少一个对象
    });
    const listResponse = await client.send(listCommand);

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const item = listResponse.Contents[0];
      if (item.Key) {
        // 获取文件的元数据
        const headCommand = new HeadObjectCommand({
          Bucket: bucketName,
          Key: item.Key,
        });
        const headResponse = await client.send(headCommand);

        let metadata = generateMetadata(
          headResponse.Metadata as Record<string, string>
        );

        // 验证文件的album和tags是否存在

        /**
         * 备注：
         * album和tags可能已经被删除，但是还存在对应的文件元数据中
         * 原因是考虑到删除时依次遍历其下所有图片元数据不太划算
         * 所以在这时需要验证并更新当前的文件元数据，删除不存在的album和tags
         */
        let albumNames = await getAllAlbumNames(client, bucketName);
        let tagNames = await getAllTagNames(client, bucketName);

        if (metadata.album.length > 0 && !albumNames.includes(metadata.album)) {
          metadata.album = "";
        }

        if (metadata.tags.length > 0) {
          metadata.tags = metadata.tags.filter((tag) => tagNames.includes(tag));
        }

        const copyCommand = new CopyObjectCommand({
          Bucket: bucketName,
          CopySource: `${bucketName}/${item.Key}`,
          Key: item.Key,
          Metadata: metadata.pack(),
          MetadataDirective: "REPLACE",
        });

        // 发送命令
        await client.send(copyCommand);
        return metadata;
      }
    }

    throw new Error("Image not found");
  } catch (error) {
    console.error("Error getting image metadata by prefix:", error);
    throw new Error("Image not found");
  }
};

// 通过hash获取图片的key
export const getImageKeyByHash = async (
  client: S3Client,
  bucketName: string,
  hash: string
): Promise<string> => {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: hash,
      MaxKeys: 1, // 只需要检查是否存在至少一个对象
    });
    const listResponse = await client.send(listCommand);

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const item = listResponse.Contents[0];
      if (item.Key) {
        return item.Key;
      }
    }
    throw new Error("Image not found");
  } catch (error) {
    console.error("Error getting image key by prefix:", error);
    throw new Error("Image not found");
  }
};

// 为图片生成在线访问链接
export const getImageSignedUrl = async (
  client: S3Client,
  bucketName: string,
  hash: string,
  expiresIn: number = 300 // 默认5分钟
): Promise<string> => {
  try {
    const key = await getImageKeyByHash(client, bucketName, hash);
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error getting image signed URL:", error);
    throw new Error("Image not found");
  }
};
