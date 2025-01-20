import { S3Client } from "@aws-sdk/client-s3";
import { listDateFilesItems, updateDataFileItems } from "../utils/dataFile";
import { PaginatedResult } from "../types/index.d";

const dataFilesPrefix = ".data/createdAt/";

export const listCratedAtItems = async (
  client: S3Client,
  bucketName: string,
  page: number,
  pageSize: number
): Promise<PaginatedResult<string>> => {
  /**
   * 按照创建时间顺序列出图片
   */
  let prefix = dataFilesPrefix;
  let result = await listDateFilesItems(
    client,
    bucketName,
    prefix,
    page,
    pageSize
  );
  return result;
};

export const createdAtAddImages = async (
  client: S3Client,
  bucketName: string,
  imageHashs: Array<string>
): Promise<boolean> => {
  /**
   * 添加 图片 到 创建时间数据文件
   */

  // 获取当前日期, 年月日
  const date = new Date();
  let key = `${dataFilesPrefix}${date.toISOString().split("T")[0]}.data`;
  let result = await updateDataFileItems(
    client,
    bucketName,
    key,
    "add",
    imageHashs
  );
  return result;
};

export const createdAtRemoveImages = async (
  client: S3Client,
  bucketName: string,
  imageHashs: Array<string>,
  createAt: Date
): Promise<boolean> => {
  /**
   * 从创建时间数据文件中删除图片
   */

  // 获取日期, 年月日
  let key = `${dataFilesPrefix}${createAt.toISOString().split("T")[0]}.data`;
  let result = await updateDataFileItems(
    client,
    bucketName,
    key,
    "remove",
    imageHashs
  );
  return result;
}
