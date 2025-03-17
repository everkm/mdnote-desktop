#!/usr/bin/env node

/**
 * 环境变量设置脚本
 * 根据 TAG 环境变量（格式如 v0.0.1-alpha.1）提取并设置 CHANNEL 环境变量
 */

// 获取 TAG 环境变量
const tag = process.env.TAG;

if (!tag) {
  console.error("错误: 未设置 TAG 环境变量");
  process.exit(1);
}

// 检查 TAG 格式是否正确
const tagRegex = /^v\d+\.\d+\.\d+(-[\w.]+)?$/;
if (!tagRegex.test(tag)) {
  console.error(`错误: TAG 环境变量格式不正确: ${tag}`);
  console.error("期望格式: v0.0.1-alpha.1");
  process.exit(1);
}

const fs = require("fs");

// 提取 channel 信息
let channel = "latest"; // 默认为 latest

if (tag.includes("-")) {
  const channelWithExtra = tag.split("-")[1];
  // 如果包含点，只取点之前的部分作为 channel（例如 alpha.1 取 alpha）
  channel = channelWithExtra.includes(".")
    ? channelWithExtra.split(".")[0]
    : channelWithExtra;
}

// 设置环境变量
process.env.CHANNEL = channel;

// 输出设置的环境变量，方便调试
console.log(`已设置环境变量 CHANNEL=${channel} (基于 TAG=${tag})`);

const fileContents = `CHANNEL=${channel}`;

// 写入 dist/.env 文件

const envJson = {
  CHANNEL: channel,
};
fs.writeFileSync("dist/.env", JSON.stringify(envJson));

// 对于使用 cross-env 或其他 npm 脚本中，可能需要额外处理
// 在 CI 环境中，可能需要写入到特定文件中
if (process.env.CI) {
  fs.appendFileSync(process.env.GITHUB_ENV || ".env", fileContents);
}
