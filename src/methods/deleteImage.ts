import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ImageNotFoundError } from "../errors";
import { getImageMetadata, getImageKeyByHash, isExistImage } from "./base";
import { Metadata } from "./metadata";
import { createdAtRemoveImages } from "./createAt";
import { albumRemoveImages } from "./album";
import { tagRemoveImages } from "./tags";

export const deleteImageStatic = async (
  client: S3Client,
  bucketName: string,
  hash: string
): Promise<boolean> => {
  try {
    if (!(await isExistImage(client, bucketName, hash))) {
      throw new ImageNotFoundError();
    }

    let metadata: Metadata = await getImageMetadata(client, bucketName, hash);

    // 更新createAt数据索引
    let createAt_result = await createdAtRemoveImages(
      client,
      bucketName,
      [hash],
      metadata.createdAt
    );
    if (!createAt_result) {
      throw new Error("Error updating createdAt data index");
    }

    // 如果有相册数据，更新相册数据索引
    if (metadata.album.length > 0) {
      // 更新album数据索引
      let album_result = await albumRemoveImages(
        client,
        bucketName,
        metadata.album,
        [hash]
      );

      if (!album_result) {
        throw new Error("Error updating album data index");
      }
    }

    // 如果有标签数据，更新标签数据索引
    if (metadata.tags.length > 0) {
      // 更新tag数据索引
      for (let tag of metadata.tags) {
        let tag_result = await tagRemoveImages(client, bucketName, tag, [hash]);
        if (!tag_result) {
          throw new Error("Error updating tag data index");
        }
      }
    }

    // 删除图片, 先得到图片的key

    let key = await getImageKeyByHash(client, bucketName, hash);

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};
