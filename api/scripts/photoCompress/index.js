const scanFolderImages = require("./scanFolderImages");
const imageCompress = require("./imageCompress");
const getExifInfo = require("./getExifInfo");
const getLocationData = require("./getLocation");
const wrightCSV = require("./wrightCSV");
const wrightJSON = require("./wrightJSON");
const { populateKeyValue, toChinese } = require("./objectUtils");
const wrightMysql = require("./wrightMysql");

let JSON = [];

async function main(config) {
    // 获取所有照片路径
    const inputType = [".jpg", ".jpeg"];
    const imgList = await scanFolderImages(config.inputPath, inputType);
    imgList.forEach((imgPath) => {
        JSON.push({ originalPath: imgPath });
    });
    console.log(`共需处理${imgList.length}张图片`);

    // 压缩图片
    const compressPromises = [];
    const totalPhotos = JSON.length;
    const progressInterval = totalPhotos > 100 ? totalPhotos / 4 : totalPhotos; // 计算进度条间隔
    for (let i = 0, j = 0; i < JSON.length; i++, j++) {
        compressPromises.push(
            imageCompress(JSON[i].originalPath, config.outputPath, config.inputPath).then((compressResult) => {
                JSON[i] = { ...JSON[i], ...compressResult };
            })
        );

        // 分片 n 张照片同时处理
        if (parseInt((i + 1) % progressInterval) === 0) {
            await Promise.all(compressPromises).then(() => {
                const progress = ((i + 1) / totalPhotos) * 100;
                console.log(`处理进度：${progress.toFixed(2)}%，已处理${i}张照片`);
            });
            compressPromises.length = 0;
        }
    }
    await Promise.all(compressPromises).then(() => {
        console.log("===所有图片压缩完毕===");
    });
    compressPromises.length = 0;

    // 读取EXIF信息 同时进行
    const exifPromise = [];
    for (let i = 0; i < JSON.length; i++) {
        exifPromise.push(
            getExifInfo(JSON[i].absolutePath).then((exifData) => {
                JSON[i] = { ...JSON[i], ...exifData };
            })
        );
    }
    await Promise.all(exifPromise).then(() => {
        console.log("===所有EXIF信息读取完毕===");
    });
    exifPromise.length = 0;

    // 地理位置分类
    // JSON = await classifyLocationGeo(JSON)
    for (let i = 0; i < JSON.length; i++) {
        try {
            const locationData = await getLocationData(JSON[i]);
            JSON[i] = { ...JSON[i], ...locationData };
        } catch (err) {
            console.log(`获取第${i + 1}张图片地理位置出错，${JSON[i]}`);
        }
    }
    console.log("===所有地理位置已获取===");

    // 布尔值分类

    const formatJSON = populateKeyValue(JSON);
    const chineseJSON = toChinese(formatJSON);
    // 写入到JSON
    wrightJSON(formatJSON, `${config.dataOutputPath}\\${config.projectName}Raw.json`);
    // 写入CSV
    wrightCSV(chineseJSON, `${config.dataOutputPath}\\${config.projectName}.csv`);
    // 写入到Mysql
    wrightMysql(formatJSON, config.mysqlTableName);

    return true;
}

async function photoCompress(inputPath, projectName) {
    const config2 = {
        inputPath,
        projectName, // 不能包含短横线
        outputPath: `./upload/${projectName}`,
        dataOutputPath: "./upload/0ImageData", // 数据输出目录
        mysqlTableName: "tb_" + projectName, // MySQL表名
    };

    return await main(config2);
}

// photoCompress("D:\\阿巴阿巴\\照片\\2025.08内蒙\\0-后期\\星空", "pojName_1");

module.exports = {
    photoCompress,
};
