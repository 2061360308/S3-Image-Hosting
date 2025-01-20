const indexFileKey = ".data/tag.data";
const dataFilesPrefix = ".data/tag/";

import { S3Client } from "@aws-sdk/client-s3";
import {
  getAllNames,
  add,
  remove,
  listItems,
  addImages,
  removeImages,
} from "../utils/classify";
import { PaginatedResult } from "../types/index.d";

export const getAllTagNames = async (
  client: S3Client,
  bucketName: string
): Promise<Array<string>> => {
  /**
   * 从 标签 索引文件中获取所有标签名称
   */
  return await getAllNames(client, bucketName, indexFileKey);
};

export const addTag = async (
  client: S3Client,
  bucketName: string,
  addNames: Array<string>
): Promise<boolean> => {
  /**
   * 添加 标签
   */
  return await add(client, bucketName, indexFileKey, addNames);
};

export const removeTag = async (
  client: S3Client,
  bucketName: string,
  removeNames: Array<string>
): Promise<boolean> => {
  /**
   * 删除 标签
   */
  return await remove(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    removeNames
  );
};

export const listTagItems = async (
  client: S3Client,
  bucketName: string,
  TagName: string,
  page: number,
  pageSize: number
): Promise<PaginatedResult<string>> => {
  /**
   * 列出 标签 中的所有图片
   */
  return await listItems(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    TagName,
    page,
    pageSize
  );
};

export const tagAddImages = async (
  client: S3Client,
  bucketName: string,
  TagName: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  /**
   * 向 标签 中添加图片
   */
  return await addImages(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    TagName,
    imageHashs
  );
};

export const tagRemoveImages = async (
  client: S3Client,
  bucketName: string,
  TagName: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  /**
   * 从 标签 中删除图片
   */
  return await removeImages(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    TagName,
    imageHashs
  );
};

export default {
  getAllTagNames, // 从 标签 索引文件中获取所有标签名称
  addTag, // 添加 标签
  removeTag, // 删除 标签
  listTagItems, // 列出 标签 中的所有图片
  tagAddImages, // 向 标签 中添加图片
  tagRemoveImages, // 从 标签 中删除图片
};
