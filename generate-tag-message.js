const { execSync } = require('child_process');

try {
  // 获取最新的标签
  const latestTag = execSync('git describe --tags --abbrev=0').toString().trim();

  // 获取从最新标签到当前的提交历史
  const commitHistory = execSync(`git log ${latestTag}..HEAD --oneline`).toString().trim();

  // 输出提交历史
  console.log(commitHistory);
} catch (error) {
  console.error('Error generating tag message:', error);
  process.exit(1);
}