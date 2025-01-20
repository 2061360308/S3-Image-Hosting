import dotenv from "dotenv";
import S3ImageHosting from "../index";
import { Settings } from "types/index.d";

// 加载 .env 文件中的环境变量
dotenv.config();

export const settings: Settings = {
  bucket: process.env.BUCKET as string,
  endpoint: process.env.ENDPOINT as string,
  region: process.env.REGION as string,
  accessKeyId: process.env.ACCESS_KEY_ID as string,
  secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
};

export const imageHosting: S3ImageHosting = new S3ImageHosting(settings);

export const images = [
  "贴纸1.jpg",
  "贴纸2.gif",
  "贴纸3.jpg",
  "贴纸4.jpg",
  "贴纸5.jpg",
  "贴纸6.jpg",
  "贴纸7.jpg",
  "贴纸8.jpg",
];

export const hashs = [
  "6aa4c9d0174acdab",
  "e0c555bf36817ed1",
  "710dfeeb6017c995",
  "a4176e575f0da099",
  "333b237c05b5cc20",
  "786deda1ce54058b",
  "4070ea8c0bd0f03a",
  "c9ee7d33a75118be",
];
