import dotenv from "dotenv";
import S3ImageHosting from "../index";

// 加载 .env 文件中的环境变量
dotenv.config();

export const settings = {
  bucket: process.env.BUCKET,
  endpoint: process.env.ENDPOINT,
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

export const imageHosting = new S3ImageHosting(settings);
