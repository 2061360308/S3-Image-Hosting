import { describe, expect, it } from "vitest";
import { imageHosting } from "./global";
import fs from "fs";

describe("Add album logo", () => {
  it("should be ['logo']", async () => {
    let allAlbumNames = await imageHosting.getAllAlbumNames();
    if (allAlbumNames.includes("logo")) {
      let result = await imageHosting.removeAlbum(["logo"]);
      console.log("Delete album result: ", result);
    }

    let result = await imageHosting.addAlbum(["logo"]);
    expect(result).toBeTruthy();
  });
});

describe("Add tag tag1, tag2", () => {
  it("should be ['logo', 'tag2']", async () => {

    let tags = ["tag1", "tag2"];

    let removeTags = [];
    for (let tag of tags) {
      let allTagNames = await imageHosting.getAllTagNames();
      if (allTagNames.includes(tag)) {
        removeTags.push(tag);
      }
    }

    if (removeTags.length > 0) {
      let result = await imageHosting.removeTag(removeTags);
      console.log("Delete tag result: ", result);
    }

    let result = await imageHosting.addTag(tags);
    expect(result).toBeTruthy();
  });
});

describe("Upload Image", () => {
  it("should upload an image", async () => {
    if (await imageHosting.isExistImage("94e2635af500225d")) {
      let result = await imageHosting.deleteImage("94e2635af500225d");
      console.log("Delete image result: ", result);
    }

    let createDate = new Date();
    // 读取图片文件
    const image = fs.readFileSync("./docs/images/icon-144x144.png");
    const result = await imageHosting.uploadImage(
      image,
      "png",
      createDate,
      createDate,
      "logo",
      ["tag1", "tag2"]
    );
    console.log("Upload image result: ", result);
    expect(result.success).toBeTruthy();
  });
});

describe("isExist", () => {
  it("isExist should be true", async () => {
    let result = await imageHosting.isExistImage("94e2635af500225d");
    expect(result).toBeTruthy();
  });
});


describe("verify metadata", () => {
    it("should be true", async () => {
        let metadata = await imageHosting.getImageMetadata("94e2635af500225d");
        console.log("metadata: ", metadata);
        expect(metadata.album).toBe("logo");
        expect(metadata.tags).toEqual(["tag1", "tag2"]);
    });
});


describe("Delete album and tag1", () => {
    it("should be true", async () => {
        let result = await imageHosting.removeAlbum(["logo"]);
        let result2 = await imageHosting.removeTag(["tag1"]);
    
        expect(result && result2).toBeTruthy();
    });
});


describe("verify metadata", () => {
    it("should be true", async () => {
        let metadata = await imageHosting.getImageMetadata("94e2635af500225d");
        console.log("metadata: ", metadata);
        expect(metadata.album).toBe("");
        expect(metadata.tags).toEqual(["tag2"]);
    });
});


describe("Delete tag2", () => {
    it("should be true", async () => {
        let result = await imageHosting.removeTag(["tag2"]);
    
        expect(result).toBeTruthy();
    });
});


describe("Delete Image", () => {
  it("should delete an image", async () => {
    let result = await imageHosting.deleteImage("94e2635af500225d");
    expect(result).toBeTruthy();
  });
});

describe("isExist", () => {
  it("isExist should be false", async () => {
    // 添加一个短暂的延迟，确保删除操作已经完全生效
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let result = await imageHosting.isExistImage("94e2635af500225d");
    expect(result).toBeFalsy();
  });
});
