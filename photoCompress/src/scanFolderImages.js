const fs = require('fs');
const path = require('path');
const config = require("../config")
const imageCompress = require("./imageCompress")


/**
 * 获取目录中所有指定格式的 JPG 文件，不包括 people 文件夹下的图片。
 * @param {string} directory - 要搜索的目录路径。
 * @param {string} format - 要搜索的文件格式，默认为 'jpg'。
 * @returns {Array<string>} - 返回一个包含所有 JPG 文件路径的数组。
 */
async function getAllJpgFilesInDir(directory, format = ['.jpg', '.jpeg']) {
    const imgList = [];

    // 读取目录中的所有文件
    const files = await fs.promises.readdir(directory);

    // 遍历目录中的所有文件
    for (const file of files) {
        const filePath = path.join(directory, file).replace(/\\/g, '/'); // 获取文件的完整路径
        const stats = await fs.promises.stat(filePath); // 获取文件信息

        // 如果是目录，则递归获取该目录下的 JPG 文件
        if (stats.isDirectory()) {
            // 排除  文件夹下的图片
            if (!config.excludeFolder.includes(file.toLowerCase())) {
                const subImgList = await getAllJpgFilesInDir(filePath, format); // 递归调用自身
                imgList.push(...subImgList); // 将子目录中的 JPG 文件路径合并到主列表中
            }
        }
        // 如果是 JPG 文件，则将其路径添加到列表中
        else if (format.includes(path.extname(file).toLowerCase())) {
            imgList.push(filePath);
        }
    }

    return imgList; // 返回所有 JPG 文件的路径列表
}



module.exports = getAllJpgFilesInDir
