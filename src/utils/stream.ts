export const streamToString = async (stream: any): Promise<string> => {
  if (typeof window !== "undefined") {
    if (stream instanceof ReadableStream) {
      // 浏览器环境中的 ReadableStream
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          result += decoder.decode(value, { stream: true });
        }
      }

      result += decoder.decode(); // flush the decoder
      return result;
    } else if (stream instanceof Blob) {
      // 浏览器环境中的 Blob
      return await stream.text();
    }
  } else {
    if (Buffer.isBuffer(stream)) {
      // Node.js 环境中的 Buffer
      return stream.toString("utf-8");
    } else if (typeof stream.on === "function") {
      // Node.js 环境中的 Readable
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });
    }
  }

  throw new Error("Unsupported stream type");
};
