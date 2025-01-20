import { describe, it, expect } from "vitest";
import { imageHosting } from "./global";
import fs from "fs";

describe("Upload Image", () => {
  it("should upload an image", async () => {

    if(await imageHosting.isExistImage("94e2635af500225d")){
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
      "",
      []
    );
    expect(result).toBeTruthy();
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let result = await imageHosting.isExistImage("94e2635af500225d");
    console.log("isExist result: ", result);
    expect(result).toBeFalsy();
  });
});