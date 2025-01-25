import { isExistImage, getImageMetadata, getImageSignedUrl, checkSettingsValid } from "./methods/base";
import { createMatadata } from "./methods/metadata";
import { uploadImageStatic } from "./methods/uploadImage";
import { deleteImageStatic } from "./methods/deleteImage";

import {
  getAllAlbumNames, // 从 相册 索引文件中获取所有相册名称
  addAlbum, // 添加 相册
  removeAlbum, // 删除 相册
  listAlbumItems, // 列出 相册 中的所有图片
  albumAddImages, // 向 相册 中添加图片
  albumRemoveImages, // 从 相册 中删除图片
} from "./methods/album";

import {
  getAllTagNames, // 从 标签 索引文件中获取所有标签名称
  addTag, // 添加 标签
  removeTag, // 删除 标签
  listTagItems, // 列出 标签 中的所有图片
  tagAddImages, // 向 标签 中添加图片
  tagRemoveImages, // 从 标签 中删除图片
} from "./methods/tags";

import { listCratedAtItems } from "./methods/createAt";

class S3ImageHostingMethods {
  public static checkSettingsValidStatic = checkSettingsValid;
  public static isExistImageStatic = isExistImage;
  public static createMatadataStatic = createMatadata;
  public static uploadImageStatic = uploadImageStatic;
  public static deleteImageStatic = deleteImageStatic;
  public static getImageMetadataStatic = getImageMetadata;
  public static getImageSignedUrlStatic = getImageSignedUrl;
  public static getAllAlbumNamesStatic = getAllAlbumNames;
  public static addAlbumStatic = addAlbum;
  public static removeAlbumStatic = removeAlbum;
  public static listAlbumItemsStatic = listAlbumItems;
  public static albumAddImagesStatic = albumAddImages;
  public static albumRemoveImagesStatic = albumRemoveImages;
  public static getAllTagNamesStatic = getAllTagNames;
  public static addTagStatic = addTag;
  public static removeTagStatic = removeTag;
  public static listTagItemsStatic = listTagItems;
  public static tagAddImagesStatic = tagAddImages;
  public static tagRemoveImagesStatic = tagRemoveImages;
  public static listCratedAtItemsStatic = listCratedAtItems;
}

export default S3ImageHostingMethods;
