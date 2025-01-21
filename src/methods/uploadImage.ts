import { S3Client } from "@aws-sdk/client-s3/dist-types/S3Client";

import { ImageType, UploadImageResult } from "types/index.d";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { Metadata } from "./metadata";

import { calculateHash } from "../utils/index";
import { isExistImage, validImageTypes } from "./base";
import { ImageAlreadyExistsError, ImageTypeError } from "../errors";
import { createdAtAddImages } from "./createAt";
import { albumAddImages } from "./album";
import { tagAddImages } from "./tags";

export const uploadImageStatic = async (
  client: S3Client,
  bucketName: string,
  fileData: Blob | Buffer | Uint8Array,
  fileType: ImageType,
  metadata: Metadata
): Promise<UploadImageResult> => {
  try {
    const hash = await calculateHash(fileData);

    // Check if image already exists
    // 不管后缀是什么，只要hash相同，就认为是同一张图片
    if (await isExistImage(client, bucketName, hash)) {
      throw new ImageAlreadyExistsError();
    }

    // Check if image type is valid
    if (!validImageTypes.includes(fileType as ImageType)) {
      throw new ImageTypeError();
    }

    // 更新createAt数据索引
    let createAt_result = await createdAtAddImages(client, bucketName, [hash]);

    if (!createAt_result) {
      throw new Error("Error updating createdAt data index");
    }

    // 如果有相册数据，更新相册数据索引
    if (metadata.album.length > 0) {
      // 更新album数据索引
      let album_result = await albumAddImages(
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
        let tag_result = await tagAddImages(client, bucketName, tag, [hash]);

        if (!tag_result) {
          throw new Error("Error updating tag data index");
        }
      }
    }

    console.log(
      "Uploading image:",
      client,
      bucketName,
      fileData,
      fileType,
      metadata
    );

    const uploadParams = {
      Bucket: bucketName,
      Key: `${hash}.${fileType}`,
      Body: fileData,
      Metadata: metadata.pack(),
    };

    const command = new PutObjectCommand(uploadParams);
    const response = await client.send(command);

    return {
      success: true,
      metadata: metadata,
      hash: hash,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
    };
  }
};
