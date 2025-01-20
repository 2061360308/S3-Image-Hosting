import { IMetadata, ImageType as _ImageType1, PaginatedResult as _PaginatedResult1, Settings, UploadImageResult as _UploadImageResult1 } from "types/index.d";
import { S3Client } from "@aws-sdk/client-s3";
import { ImageType, UploadImageResult, PaginatedResult } from "./types/index.d";
declare class Metadata implements IMetadata {
    createdAt: Date;
    updatedAt: Date;
    album: string;
    tags: Array<string>;
    constructor(create: Date, update: Date, album?: string, tags?: Array<string>);
    addTags(tags: Array<string>): void;
    setAlbum(album: string): void;
    pack(): Record<string, string>;
}
declare class S3ImageHostingMethods {
    static isExistImageStatic: (client: S3Client, bucketName: string, hash: string) => Promise<boolean>;
    static createMatadataStatic: (create: Date, update: Date, album: string, tags: string[]) => Metadata;
    static uploadImageStatic: (client: S3Client, bucketName: string, fileData: Blob | Buffer | Uint8Array, fileType: ImageType, metadata: Metadata) => Promise<UploadImageResult>;
    static deleteImageStatic: (client: S3Client, bucketName: string, hash: string) => Promise<boolean>;
    static getImageMetadataStatic: (client: S3Client, bucketName: string, hash: string) => Promise<Metadata>;
    static getImageSignedUrlStatic: (client: S3Client, bucketName: string, hash: string, expiresIn?: number) => Promise<string>;
    static getAllAlbumNamesStatic: (client: S3Client, bucketName: string) => Promise<Array<string>>;
    static addAlbumStatic: (client: S3Client, bucketName: string, addNames: Array<string>) => Promise<boolean>;
    static removeAlbumStatic: (client: S3Client, bucketName: string, removeNames: Array<string>) => Promise<boolean>;
    static listAlbumItemsStatic: (client: S3Client, bucketName: string, albumName: string, page: number, pageSize: number) => Promise<PaginatedResult<string>>;
    static albumAddImagesStatic: (client: S3Client, bucketName: string, albumName: string, imageHashs: Array<string>) => Promise<boolean>;
    static albumRemoveImagesStatic: (client: S3Client, bucketName: string, albumName: string, imageHashs: Array<string>) => Promise<boolean>;
    static getAllTagNamesStatic: (client: S3Client, bucketName: string) => Promise<Array<string>>;
    static addTagStatic: (client: S3Client, bucketName: string, addNames: Array<string>) => Promise<boolean>;
    static removeTagStatic: (client: S3Client, bucketName: string, removeNames: Array<string>) => Promise<boolean>;
    static listTagItemsStatic: (client: S3Client, bucketName: string, TagName: string, page: number, pageSize: number) => Promise<PaginatedResult<string>>;
    static tagAddImagesStatic: (client: S3Client, bucketName: string, TagName: string, imageHashs: Array<string>) => Promise<boolean>;
    static tagRemoveImagesStatic: (client: S3Client, bucketName: string, TagName: string, imageHashs: Array<string>) => Promise<boolean>;
    static listCratedAtItemsStatic: (client: S3Client, bucketName: string, page: number, pageSize: number) => Promise<PaginatedResult<string>>;
}
export default class S3ImageHosting extends S3ImageHostingMethods {
    readonly version: string;
    settings: Settings;
    client: S3Client;
    constructor(settings: Settings);
    isExistImage: (key: string) => Promise<boolean>;
    uploadImage: (fileData: Blob | Buffer | Uint8Array, fileType: _ImageType1, create: Date, update: Date, album: string, tags: string[]) => Promise<_UploadImageResult1>;
    deleteImage: (hash: string) => Promise<boolean>;
    getImageMetadata: (hash: string) => Promise<Metadata>;
    getImageSignedUrl: (hash: string, expiresIn?: number) => Promise<string>;
    getAllAlbumNames: () => Promise<string[]>;
    addAlbum: (album: Array<string>) => Promise<boolean>;
    removeAlbum: (album: Array<string>) => Promise<boolean>;
    listAlbumItems: (albumName: string, page: number, pageSize: number) => Promise<_PaginatedResult1<string>>;
    albumAddImages: (albumName: string, keys: string[]) => Promise<boolean>;
    albumRemoveImages: (albumName: string, keys: string[]) => Promise<boolean>;
    getAllTagNames: () => Promise<string[]>;
    addTag: (tag: Array<string>) => Promise<boolean>;
    removeTag: (tag: Array<string>) => Promise<boolean>;
    listTagItems: (tagName: string, page: number, pageSize: number) => Promise<_PaginatedResult1<string>>;
    tagAddImages: (tagName: string, keys: string[]) => Promise<boolean>;
    tagRemoveImages: (tagName: string, keys: string[]) => Promise<boolean>;
    listCratedAtItems: (page: number, pageSize: number) => Promise<_PaginatedResult1<string>>;
}

//# sourceMappingURL=types.d.ts.map
