const indexFileKey = ".data/album.data";
const dataFilesPrefix = ".data/album/";

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

export const getAllAlbumNames = async (
  client: S3Client,
  bucketName: string
): Promise<Array<string>> => {
  /**
   * 从 相册 索引文件中获取所有相册名称
   */
  return await getAllNames(client, bucketName, indexFileKey);
};

export const addAlbum = async (
  client: S3Client,
  bucketName: string,
  addNames: Array<string>
): Promise<boolean> => {
  /**
   * 添加 相册
   */
  return await add(client, bucketName, indexFileKey, addNames);
};

export const removeAlbum = async (
  client: S3Client,
  bucketName: string,
  removeNames: Array<string>
): Promise<boolean> => {
  /**
   * 删除 相册
   */
  return await remove(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    removeNames
  );
};

export const listAlbumItems = async (
  client: S3Client,
  bucketName: string,
  albumName: string,
  page: number,
  pageSize: number
): Promise<PaginatedResult<string>> => {
  /**
   * 列出 相册 中的所有图片
   */
  return await listItems(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    albumName,
    page,
    pageSize
  );
};

export const albumAddImages = async (
  client: S3Client,
  bucketName: string,
  albumName: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  /**
   * 向 相册 中添加图片
   */
  return await addImages(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    albumName,
    imageHashs
  );
};

export const albumRemoveImages = async (
  client: S3Client,
  bucketName: string,
  albumName: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  /**
   * 从 相册 中删除图片
   */
  return await removeImages(
    client,
    bucketName,
    indexFileKey,
    dataFilesPrefix,
    albumName,
    imageHashs
  );
};

export default {
  getAllAlbumNames, // 从 相册 索引文件中获取所有相册名称
  addAlbum, // 添加 相册
  removeAlbum, // 删除 相册
  listAlbumItems, // 列出 相册 中的所有图片
  albumAddImages, // 向 相册 中添加图片
  albumRemoveImages, // 从 相册 中删除图片
};
