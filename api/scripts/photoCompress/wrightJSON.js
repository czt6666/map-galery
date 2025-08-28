const fs = require("fs").promises;
const path = require("path");

async function writeJsonToFile(data, filePath) {
    try {
        // 获取文件所在的目录路径
        const dir = path.dirname(filePath);

        // 检查输出目录是否存在，若不存在则创建
        await fs.mkdir(dir, { recursive: true });

        // 将 JavaScript 对象转换为 JSON 字符串
        const jsonData = JSON.stringify(data, null, 2);

        // 将 JSON 字符串写入文件
        await fs.writeFile(filePath, jsonData, "utf8");

        console.log(`JSON 文件写入成功`);
    } catch (err) {
        console.error("写入文件时出错：", err);
    }
}

module.exports = writeJsonToFile;
