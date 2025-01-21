/**
 * 将 ReadableStream 转换为字符串
 * @param stream 要转换的 ReadableStream
 * @returns 转换后的字符串
 */
declare module "stream" {
  export function streamToString(stream: any): Promise<string>;
}