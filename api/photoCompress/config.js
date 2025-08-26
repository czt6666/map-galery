const config = {
    // scanFolderImages
    excludeFolder: ["people", "them", "themb"], // 不扫描这些文件夹下的照片
    // imageCompress
    watermark: {
        checkAdd: false, // 是否添加水印
        horizontal: "./const/horizontal.png", // 水印图片横向路径
        vertical: "./const/vertical.png", // 水印图片纵向路径
        size: { w: 200, h: 29 }, // 水印尺寸(px)
        padding: 10, // 水印内边距(px)
    },
    imageWidth: {
        default: 1080, // 默认图片宽度(px)
        panorama: 1920, // 全景图片宽度(px)
    },
    // getLocaton
    apiKey: "a85fd4e059de8095a430b5bffdc7d6a3", // 高德 apikey
    // output
    mysqlConfig: {
        host: "127.0.0.1",
        user: "root",
        password: "123456",
        database: "map_gallery",
    },
};

module.exports = config;
