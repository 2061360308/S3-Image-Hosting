const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { resolve } = require('path');

// 读取 package.json 文件
const packageJsonPath = resolve(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// 将版本号写入环境变量
process.env.VERSION = packageJson.version;

execSync('npx parcel build', { stdio: 'inherit' })