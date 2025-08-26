const config = {
    // index
    // inputPath: 'D:\\WebFrontEnd\\Projects\\mapGallery\\testImg', // 照片输入路径
    inputPath: "E:\\01家庭照片\\2008-2018\\2014\\2014.08.01东北行", // 照片输入路径
    inputType: [".jpg", ".jpeg"], // 扫描的图片格式 必须小写
    outputPath: "../app/upload/630东北行", // 照片输出路径
    outputDataPath: "../app/upload/0ImageData", // 数据输出目录
    outputDataFileName: "630dongbei", // 数据输出文件名
    mysqlTableName: "630dongbei", // mysql表名
    // scanFolderImages
    excludeFolder: ["people", "them", "themb"], // 不扫描这些文件夹下的照片
    // imageCompress
    isCompress: true, // 是否进行压缩(选false图片大小也会缩小)
    watermark: {
        checkAdd: true, // 是否添加水印
        horizontal: "./const/horizontal.png", // 水印图片横向路径
        vertical: "./const/vertical.png", // 水印图片纵向路径
        size: { w: 200, h: 29 }, // 水印尺寸(px)
        padding: 10, // 水印内边距(px)
    },
    imageWidth: {
        default: 1080, // 默认图片宽度(px)
        panorama: 1920, // 全景图片宽度(px)
    },
    jpegQuality: {
        quality: 80, // 图片质量(%)
        progressive: true, // 渐进式加载
        trellisQuantisation: true, // Trellis量化，优化压缩质量
        overshootDeringing: true, // 超调去锯齿，减少锯齿感
        optimiseScans: true, // 优化扫描
    },
    // getLocaton
    apiKey: "a85fd4e059de8095a430b5bffdc7d6a3", // 高德 apikey
    extensions: "base", // 信息全面性
    // output
    mysqlConfig: {
        host: "127.0.0.1",
        user: "root",
        password: "123456",
        database: "map_gallery",
    },
};

module.exports = config;
