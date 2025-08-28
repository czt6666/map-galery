// 本机:0 https服务器:1
const COMPUTER = 0;

const config = {
    COMPUTER,
    version: "0.2.0",
    PORT: 7105,
    HOST: "127.0.0.1",
    redis: {
        use: false,
        host: "127.0.0.1",
        port: 6379,
        password: "",
        db: 0,
    },
    // imageCompress
    watermark: {
        checkAdd: true, // 是否添加水印
        size: { w: 200, h: 29 }, // 水印尺寸(px)
        padding: 10, // 水印内边距(px)
    },
    imageWidth: {
        default: 1080, // 默认图片宽度(px)
        panorama: 1920, // 全景图片宽度(px)
    },
    // getLocation
    apiKey: "a85fd4e059de8095a430b5bffdc7d6a3", // 高德 apikey
    // 主机 mysql 账号 密码
    mysql: {
        port: 3307,
        user: "map_gallery",
        password: "MPjb5WSADFEBRk8C",
        database: "map_gallery",
    },
};

// mysqldump -u root -p map_gallery > map_gallery.sql
// mysqldump -u root -p map_gallery 55xidayang > 55xidayang.sql

module.exports = config;
