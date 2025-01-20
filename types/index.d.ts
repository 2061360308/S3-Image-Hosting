export interface Settings {
  bucket: string; // bucket name
  endpoint: string; // endpoint eg: https://cos.ap-chengdu.myqcloud.com
  region: string; // region eg: ap-chengdu
  accessKeyId: string;
  secretAccessKey: string;
}

export type ImageType = "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "svg";

export interface IMetadata {
  createdAt: Date;
  updatedAt: Date;
  album: string;
  tags: Array<string>;
  addTags(tags: Array<string>): void;
  setAlbum(album: string): void;
  pack(): Record<string, string>;
}

export interface UploadImageResult {
  success: boolean;
  metadata?: IMetadata;
  hash?: string;
}

export interface PaginatedResult<T> {
  page: number;
  pageSize: number;
  lastPage: boolean;
  data: Array<T>;
}