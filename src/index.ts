import {
  ImageType,
  PaginatedResult,
  Settings,
  UploadImageResult,
} from "./types/index";
import S3ImageHostingMethods from "./methods";
import { S3Client } from "@aws-sdk/client-s3";
import { Metadata } from "./methods/metadata";

class S3ImageHosting extends S3ImageHostingMethods {
  settings: Settings;
  client: S3Client;

  constructor(settings: Settings) {
    super();

    this.settings = settings;

    this.client = new S3Client({
      region: settings.region,
      endpoint: settings.endpoint,
      credentials: {
        accessKeyId: settings.accessKeyId,
        secretAccessKey: settings.secretAccessKey,
      },
    });
  }

  public isExistImage = async (key: string): Promise<boolean> => {
    /**
     * Check if the image exists in the bucket
     * @param key The key of the image
     * @returns A boolean value
     */
    return S3ImageHosting.isExistImageStatic(
      this.client,
      this.settings.bucket,
      key
    );
  };

  public uploadImage = async (
    fileData: Blob | Buffer | Uint8Array,
    fileType: ImageType,
    create: Date,
    update: Date,
    album: string,
    tags: string[]
  ): Promise<UploadImageResult> => {
    /**
     * Upload an image to the bucket
     * @param fileData The image data  type: Blob | Buffer | Uint8Array
     * @param fileType The image type  type: string (png | jpg | gif | bmp | webp | svg)
     * @param create The creation date of the image  type: Date
     * @param update The update date of the image  type: Date
     * @param album The album of the image  type: string
     * @param tags The tags of the image  type: string[]
     * @returns A boolean value
     */
    const metadata = S3ImageHosting.createMatadataStatic(
      create,
      update,
      album,
      tags
    );

    return S3ImageHosting.uploadImageStatic(
      this.client,
      this.settings.bucket,
      fileData,
      fileType,
      metadata
    );
  };

  public deleteImage = async (hash: string): Promise<boolean> => {
    /**
     * Delete an image from the bucket
     * @param hash The key of the image
     * @returns A boolean value
     */
    return S3ImageHosting.deleteImageStatic(
      this.client,
      this.settings.bucket,
      hash
    );
  };

  public getImageMetadata = async (hash: string): Promise<Metadata> => {
    /**
     * Get the metadata of the image
     * @param hash The hash of the image
     * @returns A string
     */

    return await  S3ImageHosting.getImageMetadataStatic(
      this.client,
      this.settings.bucket,
      hash
    );
  }

  public getImageSignedUrl = async (hash: string, expiresIn: number = 300): Promise<string> => {
    /**
     * Get the signed url of the image
     * @param hash The hash of the image
     * @param expiresIn The expiration time of the url, default 300 seconds
     * @returns A string
     */
    return S3ImageHosting.getImageSignedUrlStatic(
      this.client,
      this.settings.bucket,
      hash,
      expiresIn
    );
  };

  public getAllAlbumNames = async (): Promise<string[]> => {
    /**
     * Get all album names
     * @returns An array of strings
     */
    return S3ImageHosting.getAllAlbumNamesStatic(
      this.client,
      this.settings.bucket
    );
  };

  public addAlbum = async (album: Array<string>): Promise<boolean> => {
    /**
     * Add albums
     * @param album The album name
     * @returns A boolean value
     */
    return S3ImageHosting.addAlbumStatic(
      this.client,
      this.settings.bucket,
      album
    );
  };

  public removeAlbum = async (album: Array<string>): Promise<boolean> => {
    /**
     * Remove albums
     * @param album The album name
     * @returns A boolean value
     */
    return S3ImageHosting.removeAlbumStatic(
      this.client,
      this.settings.bucket,
      album
    );
  };

  public listAlbumItems = async (
    albumName: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<string>> => {
    /**
     * List all images in the album
     * @param albumName The album name
     * @param page The page number
     * @param pageSize The page size
     * @returns A paginated result {page, pageSize, lastPage, data}
     */
    return S3ImageHosting.listAlbumItemsStatic(
      this.client,
      this.settings.bucket,
      albumName,
      page,
      pageSize
    );
  };

  public albumAddImages = async (
    albumName: string,
    keys: string[]
  ): Promise<boolean> => {
    /**
     * Add images to the album
     * @param albumName The album name
     * @param keys The image keys
     * @returns A boolean value
     */
    return S3ImageHosting.albumAddImagesStatic(
      this.client,
      this.settings.bucket,
      albumName,
      keys
    );
  };

  public albumRemoveImages = async (
    albumName: string,
    keys: string[]
  ): Promise<boolean> => {
    /**
     * Remove images from the album
     * @param albumName The album name
     * @param keys The image keys
     * @returns A boolean value
     */
    return S3ImageHosting.albumRemoveImagesStatic(
      this.client,
      this.settings.bucket,
      albumName,
      keys
    );
  };

  public getAllTagNames = async (): Promise<string[]> => {
    /**
     * Get all tag names
     * @returns An array of strings
     */
    return S3ImageHosting.getAllTagNamesStatic(
      this.client,
      this.settings.bucket
    );
  };

  public addTag = async (tag: Array<string>): Promise<boolean> => {
    /**
     * Add tags
     * @param tag The tag name
     * @returns A boolean value
     */
    return S3ImageHosting.addTagStatic(this.client, this.settings.bucket, tag);
  };

  public removeTag = async (tag: Array<string>): Promise<boolean> => {
    /**
     * Remove tags
     * @param tag The tag name
     * @returns A boolean value
     */
    return S3ImageHosting.removeTagStatic(
      this.client,
      this.settings.bucket,
      tag
    );
  };

  public listTagItems = async (
    tagName: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<string>> => {
    /**
     * List all images in the tag
     * @param tagName The tag name
     * @param page The page number
     * @param pageSize The page size
     * @returns A paginated result {page, pageSize, lastPage, data}
     */
    return S3ImageHosting.listTagItemsStatic(
      this.client,
      this.settings.bucket,
      tagName,
      page,
      pageSize
    );
  };

  public tagAddImages = async (
    tagName: string,
    keys: string[]
  ): Promise<boolean> => {
    /**
     * Add images to the tag
     * @param tagName The tag name
     * @param keys The image keys
     * @returns A boolean value
     */
    return S3ImageHosting.tagAddImagesStatic(
      this.client,
      this.settings.bucket,
      tagName,
      keys
    );
  };

  public tagRemoveImages = async (
    tagName: string,
    keys: string[]
  ): Promise<boolean> => {
    /**
     * Remove images from the tag
     * @param tagName The tag name
     * @param keys The image keys
     * @returns A boolean value
     */
    return S3ImageHosting.tagRemoveImagesStatic(
      this.client,
      this.settings.bucket,
      tagName,
      keys
    );
  };

  public listCratedAtItems = async (
    page: number,
    pageSize: number
  ): Promise<PaginatedResult<string>> => {
    /**
     * List all images by creation date
     * @param page The page number
     * @param pageSize The page size
     * @returns A paginated result {page, pageSize, lastPage, data}
     */
    return S3ImageHosting.listCratedAtItemsStatic(
      this.client,
      this.settings.bucket,
      page,
      pageSize
    );
  };
}

export default S3ImageHosting;
