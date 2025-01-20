const { execSync } = require('child_process');
const path = require('path');

// 定义测试文件列表
const testFiles = [
  "./src/test/base.test.ts",
  "./src/test/uploadDelete.test.ts",
  "./src/test/album.test.ts",
  "./src/test/tag.test.ts",
  "./src/test/metadata.test.ts",
];

// 逐个运行测试文件
testFiles.forEach((file) => {
  const filePath = path.resolve(__dirname, file);
  console.log(`Running test: ${filePath}`);
  try {
    execSync(`npx vitest run ${filePath}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`Test failed: ${filePath}`);
    process.exit(1);
  }
});
