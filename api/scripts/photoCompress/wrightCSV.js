const fs = require("fs").promises;

/**
 * 从 JSON 数据生成 CSV 文件
 * @param {Array} jsonData - 要转换为 CSV 的 JSON 数据
 * @param {string} filePath - 输出 CSV 文件的路径
 * @returns {Promise} - 返回一个 Promise，表示写入文件的操作是否成功
 */
async function generateCSV(jsonData, filePath) {
    try {
        // 使用 Papaparse 将 JSON 数据转换为 CSV 格式
        const csv = "\uFEFF" + jsonToCSV(jsonData);

        // 将 CSV 数据写入文件
        await fs.writeFile(filePath, csv, "utf-8");

        console.log("CSV 文件写入成功");
        return true;
    } catch (error) {
        console.error("写入 CSV 文件时出错:", error);
        return false;
    }
}

// 将 JSON 数据转换为 CSV 格式
const jsonToCSV = (json) => {
    // 如果 json 为 undefined 或 null，则返回空字符串
    if (!json) {
        return "";
    }

    // 确保 json 是一个数组，并且至少包含一个对象
    if (!Array.isArray(json) || json.length === 0) {
        return "";
    }

    const header = Object.keys(json[0]).join(",") + "\n";
    const rows = json.map((obj) => Object.values(obj).join(",")).join("\n");
    return header + rows;
};

module.exports = generateCSV;
