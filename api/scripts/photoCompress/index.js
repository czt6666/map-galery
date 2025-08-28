const scanFolderImages = require("./scanFolderImages");
const imageCompress = require("./imageCompress");
const getExifInfo = require("./getExifInfo");
const getLocationData = require("./getLocation");
const wrightCSV = require("./wrightCSV");
const wrightJSON = require("./wrightJSON");
const { populateKeyValue, toChinese } = require("./objectUtils");
const wrightMysql = require("./wrightMysql");

async function* main(config) {
    let photos = [];

    // 获取所有照片路径
    const inputType = [".jpg", ".jpeg"];
    const imgList = await scanFolderImages(config.inputPath, inputType);
    imgList.forEach((imgPath) => {
        photos.push({ originalPath: imgPath });
    });
    let msg = `共需处理${imgList.length}张图片`;
    console.log(msg);
    yield msg;

    // 压缩图片
    const compressPromises = [];
    const totalPhotos = photos.length;
    const progressInterval = totalPhotos > 100 ? totalPhotos / 4 : totalPhotos; // 计算进度条间隔
    for (let i = 0; i < photos.length; i++) {
        compressPromises.push(
            imageCompress(photos[i].originalPath, config.outputPath, config.inputPath).then((compressResult) => {
                photos[i] = { ...photos[i], ...compressResult };
            }),
        );

        if ((i + 1) % progressInterval === 0) {
            await Promise.all(compressPromises);
            const progress = ((i + 1) / totalPhotos) * 100;
            msg = `处理进度：${progress.toFixed(2)}%，已处理${i + 1}张照片`;
            console.log(msg);
            yield msg;
            compressPromises.length = 0;
        }
    }
    await Promise.all(compressPromises);
    msg = "===所有图片压缩完毕===";
    console.log(msg);
    yield msg;

    // 读取EXIF信息
    const exifPromise = [];
    for (let i = 0; i < photos.length; i++) {
        exifPromise.push(
            getExifInfo(photos[i].absolutePath).then((exifData) => {
                photos[i] = { ...photos[i], ...exifData };
            }),
        );
    }
    await Promise.all(exifPromise);
    msg = "===所有EXIF信息读取完毕===";
    console.log(msg);
    yield msg;

    // 地理位置分类
    for (let i = 0; i < photos.length; i++) {
        try {
            const locationData = await getLocationData(photos[i]);
            photos[i] = { ...photos[i], ...locationData };
        } catch (err) {
            msg = `获取第${i + 1}张图片地理位置出错，${photos[i].originalPath}`;
            console.log(msg);
            yield msg;
        }
    }
    msg = "===所有地理位置已获取===";
    console.log(msg);
    yield msg;

    // 数据格式化
    const formatJSON = populateKeyValue(photos);
    const chineseJSON = toChinese(formatJSON);

    // 写文件/数据库
    wrightJSON(formatJSON, `${config.dataOutputPath}\\${config.projectName}Raw.json`);
    wrightCSV(chineseJSON, `${config.dataOutputPath}\\${config.projectName}.csv`);
    wrightMysql(formatJSON, config.mysqlTableName);

    msg = "===数据写出完毕===";
    console.log(msg);
    yield msg;

    return true;
}

async function* photoCompress(inputPath, projectName) {
    const config2 = {
        inputPath,
        projectName: projectName.replace(/-/g, "_"), // 不能包含短横线
        outputPath: `./upload/${projectName}`, // 图片输出目录
        dataOutputPath: "./upload/0ImageData", // 数据输出目录
        mysqlTableName: "tb_" + projectName, // MySQL表名
    };

    yield* main(config2);
}

module.exports = {
    photoCompress,
};
