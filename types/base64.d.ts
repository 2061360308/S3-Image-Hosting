declare module 'base64' {
  /**
   * 将字符串编码为 Base64
   * @param str 要编码的字符串
   * @returns 编码后的 Base64 字符串
   */
  export function toBase64(str: string): string;

  /**
   * 将 Base64 字符串解码为普通字符串
   * @param base64 要解码的 Base64 字符串
   * @returns 解码后的普通字符串
   */
  export function fromBase64(base64: string): string;
}
