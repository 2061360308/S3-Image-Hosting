/**
 * 分类相关的基础方法（相册、标签）
 * Basic methods related to classification (album, tag)
 */

import { S3Client } from "@aws-sdk/client-s3";
import {
  getDataFileItems,
  updateDataFileItems,
  listDateFilesItems,
} from "./dataFile";
import { deleteFilesWithPrefix } from "../methods/base";
import { NameAlreadyExistsError, InvalidNameError } from "../errors";
import { PaginatedResult } from "../types";

// 从 相册|标签 索引文件中获取所有 相册|标签 名称
export const getAllNames = async (
  client: S3Client,
  bucketName: string,
  indexFileKey: string
): Promise<Array<string>> => {
  let albumNames = await getDataFileItems(client, bucketName, indexFileKey);
  return albumNames;
};

// 添加 相册|标签
export const add = async (
  client: S3Client,
  bucketName: string,
  indexFileKey: string,
  addNames: Array<string>
): Promise<boolean> => {
  // 判断相册是否已经存在
  const allNames = await getAllNames(client, bucketName, indexFileKey);
  for (let name of addNames) {
    if (allNames.includes(name)) {
      throw new NameAlreadyExistsError();
    }
  }

  let result = await updateDataFileItems(
    client,
    bucketName,
    indexFileKey,
    "add",
    addNames
  );

  return result;
};

// 删除 相册|标签
export const remove = async (
  client: S3Client,
  bucketName: string,
  indexFileKey: string,
  dataFilesPrefix: string,
  removeNames: Array<string>
): Promise<boolean> => {
  // 判断相册是否存在
  const allNames = await getAllNames(client, bucketName, indexFileKey);
  for (let name of removeNames) {
    if (!allNames.includes(name)) {
      throw new InvalidNameError();
    }
  }

  let result = await updateDataFileItems(
    client,
    bucketName,
    indexFileKey,
    "remove",
    removeNames
  );

  // Todo: 不能保证所有数据文件都删除成功，数据不一致处理
  for (let name of removeNames) {
    let prefix = `${dataFilesPrefix}${name}`;
    let _result = await deleteFilesWithPrefix(client, bucketName, prefix);
    result = result && _result;
  }

  return result;
};

// 列出 相册|标签 中的所有图片
export const listItems = async (
  client: S3Client,
  bucketName: string,
  indexFileKey: string,
  dataFilesPrefix: string,
  name: string,
  page: number,
  pageSize: number
): Promise<PaginatedResult<string>> => {
  // 判断 相册|标签 是否存在
  const allNames = await getAllNames(client, bucketName, indexFileKey);

  if (!allNames.includes(name)) {
    throw new InvalidNameError();
  }

  let prefix = `${dataFilesPrefix}${name}`;
  let result = await listDateFilesItems(
    client,
    bucketName,
    prefix,
    page,
    pageSize
  );
  return result;
};

// 向 相册|标签 中添加图片
export const addImages = async (
  client: S3Client,
  bucketName: string,
  indexFileKey: string,
  dataFilesPrefix: string,
  name: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  // 判断 相册|标签 是否存在
  const allNames = await getAllNames(client, bucketName, indexFileKey);
  if (!allNames.includes(name)) {
    throw new InvalidNameError();
  }

  // 计算图片分布的文件
  let imagePaths: Record<string, Array<string>> = {};
  for (let hash of imageHashs) {
    let key = `${dataFilesPrefix}${name}/${hash.slice(0, 2)}.data`;
    if (!imagePaths[key]) {
      imagePaths[key] = [];
    }
    imagePaths[key].push(hash);
  }

  let result = true;
  // Todo: 不能保证所有图片都添加成功，数据不一致处理
  for (let key in imagePaths) {
    let res = await updateDataFileItems(
      client,
      bucketName,
      key,
      "add",
      imagePaths[key]
    );
    result = result && res;
  }

  return result;
};

// 从 相册|标签 中删除图片
export const removeImages = async (
  client: S3Client,
  bucketName: string,
  indexFileKey: string,
  dataFilesPrefix: string,
  name: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  // 判断相册是否存在
  const allNames = await getAllNames(client, bucketName, indexFileKey);
  if (!allNames.includes(name)) {
    throw new InvalidNameError();
  }

  // 计算图片分布的文件
  let imagePaths: Record<string, Array<string>> = {};
  for (let hash of imageHashs) {
    let key = `${dataFilesPrefix}${name}/${hash.slice(0, 2)}.data`;
    if (!imagePaths[key]) {
      imagePaths[key] = [];
    }
    imagePaths[key].push(hash);
  }

  let result = true;
  // Todo: 不能保证所有图片都添加成功，数据不一致处理
  for (let key in imagePaths) {
    let res = await updateDataFileItems(
      client,
      bucketName,
      key,
      "add",
      imagePaths[key]
    );
    result = result && res;
  }

  return result;
};