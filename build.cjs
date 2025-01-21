const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

// 读取 package.json 文件
const packageJsonPath = resolve(__dirname, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

// 将版本号写入环境变量
process.env.VERSION = packageJson.version;

execSync("npx parcel build", { stdio: "inherit" });

const filePath = resolve(__dirname, "dist/types.d.ts");

// 读取文件内容
let fileContent = readFileSync(filePath, "utf8");

// 去掉 `export default S3ImageHosting`
fileContent = fileContent.replace(/export default S3ImageHosting;/, "");

// 将 "../types" 替换成 "types/index.d"
fileContent = fileContent.replace(/"..\/types"/g, '"types/index.d"');

// 写回文件
writeFileSync(filePath, fileContent, "utf8");

console.log("Post-build modifications completed.");
