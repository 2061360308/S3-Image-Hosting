export const toBase64 = (str: string): string => {
  if (typeof window !== "undefined") {
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return Buffer.from(data).toString("base64");
  }
};

export const fromBase64 = (str: string): string => {
  if (typeof window !== "undefined") {
    return decodeURIComponent(escape(atob(str)));
  } else {
    const data = Buffer.from(str, "base64");
    const decoder = new TextDecoder();
    return decoder.decode(data);
  }
};