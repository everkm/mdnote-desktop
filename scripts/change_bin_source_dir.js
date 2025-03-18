const fs = require("fs");
const path = require("path");

// 读取 package.json 文件
const packageJsonPath = path.resolve(__dirname, "../package.json");
let packageJson;

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
  packageJson = JSON.parse(packageJsonContent);

  // 检查并修改 extraResources 路径
  if (
    packageJson.build &&
    packageJson.build.extraResources &&
    Array.isArray(packageJson.build.extraResources)
  ) {
    packageJson.build.extraResources = packageJson.build.extraResources.map(
      (resource) => {
        if (
          resource.from &&
          resource.from.includes(
            "bin/${os}/${arch}/"
          )
        ) {
          return {
            ...resource,
            from: "resource/bin/${os}/${arch}/",
          };
        }
        return resource;
      }
    );

    // 将修改后的 JSON 写回文件
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
      "utf8"
    );

    console.log("Successfully updated bin source directory in package.json");
  } else {
    console.error("Could not find extraResources in build configuration");
  }
} catch (error) {
  console.error("Error processing package.json:", error);
  process.exit(1);
}
