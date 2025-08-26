// 本机:0 https服务器:1
const COMPUTER = 0

const config = {
    COMPUTER,
    version: "0.1.5",
    PORT: 7105,
    redis: {
        use: false,
        host: "127.0.0.1",
        port: 6379,
        password: "",
        db: 0,
    },
    // 数据表名
    tableNames: [
        "36guangxi", "36xinjiang", "36chongqing",
        "37chunjie", "37hangzhou", "37yytyinghua",
        "37xiaoyuanqiujing", "37bulaotun", "37beihaixue",
        "37jinguangcd", "37taoyuanxiangu", "37lizesoho",
        "37guixiaoshi", "37beilizaochun", "37beilichunxue",
        "55xidayang",
    ],
    // 主机 mysql 账号 密码
    mysql_user: "map_gallery",
    mysql_password: "MPjb5WSADFEBRk8C",
    database: 'map_gallery',
}

// mysqldump -u root -p map_gallery > map_gallery.sql
// mysqldump -u root -p map_gallery 55xidayang > 55xidayang.sql


module.exports = config;