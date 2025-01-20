/**
 * 用于处理数据文件的工具函数
 * Tool functions for processing data files
 */

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { isFileExist } from "../methods/base";
import { streamToString } from "./base";
import { PaginatedResult } from "types/index.d";

export const decodeDataFileSourceContent = (body: string): Array<string> => {
  /**
   * 处理数据文件原始内容
   */
  const lines = body.split("\n");
  if (lines[lines.length - 1] === "") {
    lines.pop(); // 移除最后一个空字符串
  }
  return lines;
};

export const encodeDataFileSourceContent = (data: Array<string>): string => {
  /**
   * 编码数据文件原始内容
   */
  return data.join("\n") + "\n";
};

export const getDataFilesSizes = async (
  client: S3Client,
  bucketName: string,
  prefix: string
): Promise<Record<string, number>> => {
  /**
   * 给出前缀，返回该前缀下的所有数据文件的大小(字节)
   */
  const sizes: Record<string, number> = {};
  let continuationToken: string | undefined = undefined;

  do {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
      MaxKeys: 1000, // 设置每个请求返回的最大对象数量
    });
    const response = await client.send(command);

    response.Contents?.forEach((item) => {
      if (item.Key && item.Size !== undefined) {
        sizes[item.Key] = item.Size;
      }
    });

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return sizes;
};

export const getDataFilesItemsNums = async (
  client: S3Client,
  bucketName: string,
  prefix: string
): Promise<Record<string, number>> => {
  /**
   * 给出前缀，返回该前缀下的所有数据文件的条目数
   */
  let sizes = await getDataFilesSizes(client, bucketName, prefix);
  let nums: Record<string, number> = {};

  for (let key in sizes) {
    nums[key] = Math.ceil(sizes[key] / 17);
  }

  // 按照键对结果进行排序
  const sortedKeys = Object.keys(nums).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
  const sortedNums: Record<string, number> = {};
  for (let key of sortedKeys) {
    sortedNums[key] = nums[key];
  }

  return sortedNums;
};

export const getDataFileItems = async (
  client: S3Client,
  bucketName: string,
  key: string
): Promise<Array<string>> => {
  /**
   * 获取数据文件中的所有条目
   */
  let hasFile = await isFileExist(client, bucketName, key);

  if (!hasFile) {
    return [];
  } else {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const response = await client.send(command);
    const body = await streamToString(response.Body);
    return decodeDataFileSourceContent(body);
  }
};

export const updateDataFileItems = async (
  client: S3Client,
  bucketName: string,
  key: string,
  type: "add" | "remove",
  value: Array<string>
): Promise<boolean> => {
  /**
   * 更新数据文件中的条目
   */
  // 获取原始数据
  let data = await getDataFileItems(client, bucketName, key);

  // 更新数据
  if (type === "add") {
    data = data.concat(value);
  } else if (type === "remove") {
    data = data.filter((item) => !value.includes(item));
  }

  // 如果数据为空，直接删除远程文件
  if (data.length === 0) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await client.send(command);
      return true;
    } catch (error) {
      console.error(`Error deleting data file ${key}:`, error);
      return false;
    }
  }

  // 如果数据不为空，则需要上传数据
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: encodeDataFileSourceContent(data),
    };

    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    return true;
  } catch (error) {
    console.error("Error updating metadata global file:", error);
    return false;
  }
};

export const listDateFilesItems = async (
  client: S3Client,
  bucketName: string,
  prefix: string,
  page: number,
  pageSize: number
): Promise<PaginatedResult<string>> => {
  let result: Array<string> = [];

  let start = (page - 1) * pageSize;
  let end = page * pageSize;

  let dataFilesItemsNums = await getDataFilesItemsNums(
    client,
    bucketName,
    prefix
  );

  const totalNum = Object.values(dataFilesItemsNums).reduce(
    (acc, num) => acc + num,
    0
  );

  let currentCount = 0;
  let hasMoreData = false;

  for (let fileKey in dataFilesItemsNums) {
    let num = dataFilesItemsNums[fileKey];

    if (currentCount + num > start) {
      let fileStartIndex = Math.max(0, start - currentCount);
      let fileEndIndex = Math.min(num, end - currentCount);

      // 获取文件内容
      const lines = await getDataFileItems(client, bucketName, fileKey);

      // 获取所需范围的数据
      result.push(...lines.slice(fileStartIndex, fileEndIndex));

      if (result.length >= pageSize) {
        hasMoreData = currentCount + num > end;
        break;
      }
    }

    currentCount += num;
  }

  result = result.slice(0, pageSize); // 确保结果不超过pageSize

  const lastPage = page * pageSize < totalNum;

  return {
    page,
    pageSize,
    lastPage,
    data: result,
  };
};
