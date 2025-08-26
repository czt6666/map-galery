const scanFolderImages = require('./src/scanFolderImages')
const imageCompress = require('./src/imageCompress')
const getExifInfo = require('./src/getExifInfo')
const getLocationData = require('./src/getLocation')
const wrightCSV = require('./src/wrightCSV')
const wrightJSON = require('./src/wrightJSON')
const { populateKeyValue, toChinese } = require('./src/objectUtils')
const wrightMysql = require('./src/wrightMysql')
const config = require('./config')


let JSON = []

async function main() {
    // 获取所有照片路径
    const imgList = await scanFolderImages(config.inputPath, config.inputType);
    imgList.forEach(imgPath => {
        JSON.push({ originalPath: imgPath })
    })
    console.log(`共需处理${imgList.length}张图片`);

    // 压缩图片
    const compressPromises = [];
    const totalPhotos = JSON.length;
    const progressInterval = totalPhotos > 100 ? totalPhotos / 4 : totalPhotos; // 计算进度条间隔
    for (let i = 0, j = 0; i < JSON.length; i++, j++) {
        compressPromises.push(
            imageCompress(JSON[i].originalPath, config.outputPath)
                .then(compressResult => {
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
        console.log('===所有图片压缩完毕===');
    });
    compressPromises.length = 0;


    // 读取EXIF信息 同时进行
    const exifPromise = []
    for (let i = 0; i < JSON.length; i++) {
        exifPromise.push(
            getExifInfo(JSON[i].absolutePath)
                .then(exifData => {
                    JSON[i] = { ...JSON[i], ...exifData }
                })
        )
    }
    await Promise.all(exifPromise).then(() => {
        console.log('===所有EXIF信息读取完毕===');
    });
    exifPromise.length = 0


    // 地理位置分类
    // JSON = await classifyLocationGeo(JSON)
    for (let i = 0; i < JSON.length; i++) {
        try {
            const locationData = await getLocationData(JSON[i])
            JSON[i] = { ...JSON[i], ...locationData };
        } catch (err) {
            console.log(`获取第${i + 1}张图片地理位置出错，${JSON[i]}`);
        }
    }
    console.log("===所有地理位置已获取===");

    // 布尔值分类


    const formatJSON = populateKeyValue(JSON)
    const chineseJSON = toChinese(formatJSON)
    // 写入到JSON
    wrightJSON(formatJSON, `${config.outputDataPath}\\${config.outputDataFileName}Raw.json`)
    // 写入CSV
    wrightCSV(chineseJSON, `${config.outputDataPath}\\${config.outputDataFileName}.csv`)
    // 写入到Mysql
    wrightMysql(formatJSON, config.mysqlTableName)

    return true
}

// 顺序执行经纬度解析
async function classifyLocationGeo(JSON) {
    // 所有地址请求成功时返回
    return new Promise(resolve => {
        // 递归调用promise 保证照片顺序查找
        JSON.reduce((previousPromise, item, i) => {
            // 在前一个Promise.then方法中调用下一个函数
            return previousPromise.then(() =>
                getLocationData(item)
                    .then((locationData) => {
                        JSON[i] = { ...JSON[i], ...locationData }
                    }));
        }, Promise.resolve())
            .then(() => {
                console.log("===所有地理位置已获取===");
                resolve(JSON)
            })
            .catch(error => {
                console.error("===地理位置获取失败===", error);
                resolve(JSON)
            });
    })
}


main()