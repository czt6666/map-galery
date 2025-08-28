const { ExifImage } = require("exif");
const { promisify } = require("util");
const path = require("path");

// 将 ExifImage 函数 Promise 化
const exifImagePromise = promisify(ExifImage);

/**
 * 获取图片的 Exif 数据
 * @param {string} imagePath - 图片路径
 * @returns {object} - 包含图片 Exif 数据的对象
 */
async function getExifData(imagePath) {
    try {
        // 获取图片的 Exif 数据
        const exifData = await exifImagePromise({ image: imagePath });

        // 将 Exif 数据写入 JSON 文件
        if (1 == 0) {
            const fileName = path.basename(imagePath);
            const outputFile = path.join("./", `exif_${fileName}.json`);
            writeJsonToFile(outputFile, exifData);
        }

        // 将日期时间字符串转换为标准格式 "YYYY-MM-DD HH:mm:ss"
        const dateTimeString = exifData?.exif?.DateTimeOriginal || "";
        const standardDateTimeString = dateTimeString.replace(
            /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
            "$1-$2-$3 $4:$5:$6",
        );

        // 提取 Exif 数据中的相关信息
        const shotDate = exifData?.exif?.DateTimeOriginal?.split(" ")[0] || ""; // 拍摄日期
        const shotTime = exifData?.exif?.DateTimeOriginal?.split(" ")[1] || ""; // 拍摄时间
        const shotTimestamp = Date.parse(standardDateTimeString).toString();
        const cameraModel = exifData?.image?.Model || ""; // 拍摄设备
        const apertureValue = exifData?.exif?.FNumber || ""; // 光圈值
        const exposureTime = exifData?.exif?.ExposureTime || ""; // 曝光时间
        const ISO = exifData?.exif?.ISO || ""; // ISO
        const exposureCompensation = exifData?.exif?.ExposureCompensation || ""; // 曝光补偿
        const focalLength = exifData?.exif?.FocalLength || ""; // 焦距
        const meteringMode = exifData?.exif?.MeteringMode || ""; // 测光模式

        // 获取地理位置信息
        let location = {};
        if (exifData.gps) {
            location = convertGPSDataToDecimal(exifData.gps);
        }

        // 输出获取的信息
        if (1 === 0) {
            console.log("拍摄日期:", shotDate);
            console.log("拍摄时间:", shotTime);
            console.log("拍摄时间戳:", shotTimestamp);
            console.log("拍摄设备:", cameraModel);
            console.log("光圈值:", apertureValue);
            console.log("曝光时间:", exposureTime);
            console.log("ISO:", ISO);
            console.log("曝光补偿:", exposureCompensation);
            console.log("焦距:", focalLength);
            console.log("测光模式:", meteringMode);
            console.log("地理位置:", location);
        }

        // 返回所有获取的信息
        return {
            ...location,
            shotDate,
            shotTime,
            shotTimestamp,
            cameraModel,
            apertureValue,
            exposureTime,
            ISO,
            exposureCompensation,
            focalLength,
            meteringMode,
        };
    } catch (error) {
        console.error("Error: " + error.message);
        throw error;
    }
}

/**
 * 将 GPS 数据转换为十进制格式
 * @param {object} gpsData - GPS 数据对象
 * @returns {object} - 包含转换后的 GPS 数据的对象
 */
function convertGPSDataToDecimal(gpsData) {
    if (!gpsData.GPSLatitude || gpsData.GPSLatitude[0] === 0) {
        return {};
    }

    try {
        const latitudeRef = gpsData.GPSLatitudeRef;
        const latitude = convertCoordinateToDecimal(gpsData.GPSLatitude);
        const longitudeRef = gpsData.GPSLongitudeRef;
        const longitude = convertCoordinateToDecimal(gpsData.GPSLongitude);
        const altitude = gpsData.GPSAltitude;

        return {
            latitudeRef,
            latitude,
            longitudeRef,
            longitude,
            altitude,
        };
    } catch (error) {
        // console.log('无GPS信息');
        return {};
    }
}

/**
 * 将坐标转换为十进制格式
 * @param {array} coordinate - 坐标数组 [degrees, minutes, seconds]
 * @returns {number} - 十进制格式的坐标
 */
function convertCoordinateToDecimal(coordinate) {
    const degrees = coordinate[0];
    const minutes = coordinate[1];
    const seconds = coordinate[2];

    const decimal = degrees + minutes / 60 + seconds / 3600;
    return decimal.toFixed(6); // 保留6位小数
}

if (1 === 0) {
    const imagePath = "D:/WebFrontEnd/Study/mapGallery/新疆照片225/7.23/IMG_6021.JPEG";
    const result = getExifData(imagePath);
    console.log(result);
}

module.exports = getExifData;
