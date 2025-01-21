/**
 * Calculate the SHA256 hash of a file
 * @param fileData The file data Blob | Buffer | Uint8Array
 */
import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

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
