export interface Settings {
  bucket: string; // bucket name
  endpoint: string; // endpoint eg: https://cos.ap-chengdu.myqcloud.com
  region: string; // region eg: ap-chengdu
  accessKeyId: string;
  secretAccessKey: string;
}

export enum ImageType {
  JPEG = "jpg",
  PNG = "png",
  GIF = "gif",
  BMP = "bmp",
  WEBP = "webp",
  SVG = "svg",
}

interface PaginatedResult<T> {
  page: number;
  pageSize: number;
  lastPage: boolean;
  data: Array<T>;
}
