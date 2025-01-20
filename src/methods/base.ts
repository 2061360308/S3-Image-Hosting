import { S3Client } from "@aws-sdk/client-s3/dist-types/S3Client";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { generateMetadata } from "./metadata";
import { Metadata } from "./metadata";

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
    console.log(response);
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

export const isFileExist = async (
  client: S3Client,
  bucketName: string,
  key: string
): Promise<boolean> => {
  /**
   * 是否存在文件
   */
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error("Error checking image existence:", error);
    return false;
  }
};

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

export const deleteFilesWithPrefix = async (
  client: S3Client,
  bucketName: string,
  prefix: string
): Promise<boolean> => {
  /**
   * 删除某个前缀下的所有文件
   */
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
      await client.send(deleteCommand);
    }

    return true;
  } catch (error) {
    console.error("Error deleting files:", error);
    return false;
  }
};

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

        return generateMetadata(
          headResponse.Metadata as Record<string, string>
        );
      }
    }

    throw new Error("Image not found");
  } catch (error) {
    console.error("Error getting image metadata by prefix:", error);
    throw new Error("Image not found");
  }
};

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
    console.error("Error getting image metadata by prefix:", error);
    throw new Error("Image not found");
  }
};
