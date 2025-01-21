/**
 * Pack And Unpack Metadata
 */
import {
  TagNameOverflowError,
  TagsOverflowError,
  AlbumNameOverflowError,
} from "../errors";
import { toBase64, fromBase64 } from "../utils/index";
import { IMetadata } from "types/index.d";

export const generateMetadata = (data: Record<string, string>): Metadata => {
  return new Metadata(
    new Date(data.createdat),
    new Date(data.updatedat),
    fromBase64(data.album),
    fromBase64(data.tags).split(",").filter(tag => tag !== "")
  );
};

export const createMatadata = (
  create: Date,
  update: Date,
  album: string,
  tags: string[]
): Metadata => {
  return new Metadata(create, update, album, tags);
};

export class Metadata implements IMetadata {
  createdAt: Date;
  updatedAt: Date;
  album: string = "";
  tags: Array<string> = [];

  constructor(
    create: Date,
    update: Date,
    album: string = "",
    tags: Array<string> = []
  ) {
    this.createdAt = create;
    this.updatedAt = update;

    this.addTags(tags);
    this.setAlbum(album);
  }

  addTags(tags: Array<string>): void {
    if (this.tags.length + tags.length > 50) {
      throw new TagsOverflowError();
    }

    for (const tag of tags) {
      if (tag.length > 8) {
        throw new TagNameOverflowError();
      }
    }

    this.tags.push(...tags);
  }

  setAlbum(album: string): void {
    if (album.length > 20) {
      throw new AlbumNameOverflowError();
    }
    this.album = album;
  }

  pack(): Record<string, string> {
    return {
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      album: toBase64(this.album),
      tags: toBase64(this.tags.join(",")),
    };
  }
}
