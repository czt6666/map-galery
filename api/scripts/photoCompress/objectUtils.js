// 定义键值对应的中文名称
const translations = {
    relativePath: "相对路径",
    fileName: "文件名",
    format: "格式",
    fileSize: "文件大小KB",
    width: "像素宽度",
    height: "像素高度",
    density: "分辨率",
    latitudeRef: "纬度参考",
    latitude: "纬度",
    longitudeRef: "经度参考",
    longitude: "经度",
    altitude: "海拔",
    shotDate: "拍摄日期",
    shotTime: "拍摄时间",
    shotTimestamp: "拍摄时间戳",
    cameraModel: "相机型号",
    apertureValue: "光圈值",
    exposureTime: "曝光时间",
    ISO: "ISO",
    exposureCompensation: "曝光补偿",
    focalLength: "焦距",
    meteringMode: "测光模式",
    province: "省份",
    city: "城市",
    district: "区县",
    isAerialShot: "是否是航拍",
    isPostProduction: "是否后期",
};

// 补全信息
function completeInformation(JSON) {
    const newJSON = [];
    for (const obj of JSON) {
        const translatedObj = {};
        for (const key in translations) {
            translatedObj[key] = obj[key] || "";
        }
        newJSON.push(translatedObj);
    }
    return newJSON;
}

// 翻译为中文
function translateObject(JSON) {
    const newJSON = [];
    for (const obj of JSON) {
        const translatedObj = {};
        for (const key in translations) {
            const chineseKey = translations[key];
            translatedObj[chineseKey] = obj[key] || "";
        }
        newJSON.push(translatedObj);
    }
    return newJSON;
}

module.exports = {
    populateKeyValue: completeInformation,
    toChinese: translateObject,
};
