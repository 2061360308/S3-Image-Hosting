import { describe, it, expect } from "vitest";
import { imageHosting, images, hashs } from "./global";
import fs from "fs";
import { ImageType } from "types/index.d";

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

describe("Get all album names", () => {
  it("should be ['logo']", async () => {
    let result = await imageHosting.getAllAlbumNames();
    expect(result).toEqual(["logo"]);
  });
});

describe("upload image to album", () => {
  it("should upload an image", async () => {
    if (await imageHosting.isExistImage("94e2635af500225d")) {
      let result = await imageHosting.deleteImage("94e2635af500225d");
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
      []
    );
    expect(result.success).toBeTruthy();
  });
});

describe("isExist", () => {
  it("isExist should be true", async () => {
    let result = await imageHosting.isExistImage("94e2635af500225d");
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

describe("Delete album", () => {
  it("should delete an album logo", async () => {
    let result = await imageHosting.removeAlbum(["logo"]);
    expect(result).toBeTruthy();
  });
});

describe("Get all album names", () => {
  it("should be []", async () => {
    let result = await imageHosting.getAllAlbumNames();
    expect(result).toEqual([]);
  });
});

describe("Add album emoticon", () => {
  it("should be ['emoticon']", async () => {
    let result = await imageHosting.addAlbum(["emoticon"]);
    expect(result).toBeTruthy();
  });
});

describe("upload image", () => {
  it("should upload an image", async () => {
    // 如果之前存在这些图片，先删除
    for (let i = 0; i < hashs.length; i++) {
      if (await imageHosting.isExistImage(hashs[i])) {
        let result = await imageHosting.deleteImage(hashs[i]);
      }
    }

    for (let i = 0; i < images.length; i++) {
      let createDate = new Date();
      // 读取图片文件
      const image = fs.readFileSync(`./docs/images/${images[i]}`);
      const result = await imageHosting.uploadImage(
        image,
        images[i].split(".")[1] as ImageType,
        createDate,
        createDate,
        "",
        []
      );
      expect(result).toBeTruthy();
    }

  }, 10000);
});

describe("add images to album", () => {
  it("should add 8 images to album", async () => {
    let result = await imageHosting.albumAddImages("emoticon", hashs);

    expect(result).toBeTruthy();
  });
});

describe("list images by album", () => {
  it("page num should be ", async () => {
    let page = 1;
    const pageSize = 2;
    let hasPage = true;
    do {
      let result = await imageHosting.listAlbumItems("emoticon", page, pageSize);
      console.log("result: ", result);
      hasPage = result.lastPage;
      page++;
    } while (hasPage);
    expect(page).toBe(5);
  });
});

describe("remove all images", () => {
  it("should delete 8 images", async () => {
    let result = true;
    for (let i = 0; i < hashs.length; i++) {
      let r = await imageHosting.deleteImage(hashs[i]);
      result = result && r;
    }
    expect(result).toBeTruthy();
  });
}, 10000);

describe("Delete album", () => {
  it("should delete an album emoticon", async () => {
    let result = await imageHosting.removeAlbum(["emoticon"]);
    expect(result).toBeTruthy();
  });
});

describe("Get all album names", () => {
  it("should be []", async () => {
    let result = await imageHosting.getAllAlbumNames();
    expect(result).toEqual([]);
  });
});