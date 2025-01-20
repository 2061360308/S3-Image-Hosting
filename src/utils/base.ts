/**
 * 基础工具函数
 * Basic Tool Functions
 */

import CryptoJS from "crypto-js";

export const calculateHash = async (
  fileData: Blob | Buffer | Uint8Array
): Promise<string> => {
  let wordArray;
  if (fileData instanceof Uint8Array || fileData instanceof Buffer) {
    wordArray = CryptoJS.lib.WordArray.create(fileData);
  } else if (fileData instanceof Blob) {
    const arrayBuffer = await fileData.arrayBuffer();
    wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
  } else {
    throw new Error("Unsupported file data type");
  }
  return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex).substring(0, 16);
};

export const toBase64 = (str: string): string => {
  if (typeof window !== "undefined") {
    // 浏览器环境
    return btoa(str);
  } else {
    // Node.js 环境
    return Buffer.from(str).toString('base64');
  }
};

export const fromBase64 = (str: string): string => {
  if (typeof window !== "undefined") {
    // 浏览器环境
    return atob(str);
  } else {
    // Node.js 环境
    return Buffer.from(str, 'base64').toString();
  }
};

// 辅助函数：将流转换为字符串
export const streamToString = (stream: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};