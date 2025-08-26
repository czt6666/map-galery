const express = require('express');
const https = require('https');
const cors = require('cors');
const path = require('path');
const fs = require("fs");
const app = express();
app.use(cors());
const config = require('./config')
const db = require("./util/queryDataBase");
const util = require("./util/index")

app.get('/geturldata', async (req, res) => {
    const { database } = req.query;
    const tableNames = util.normalizeTableNames(database)
    const data = await db.queryMutData(tableNames);
    const result = data.map(item => new Object({
        gps: [Number(item.longitude), Number(item.latitude)],
        imgSrc: item.relativePath,
        fileSize: item.fileSize,
        shotDate: item.shotDate,
        shotTime: item.shotTime,
        shotTimestamp: item.shotTimestamp,
        isAerialShot: item.isAerialShot,
        province: item.province,
        city: item.city,
        district: item.district,
    }))
    res.send(result);
});

// 监听端口
if (config.COMPUTER === 0) {
    const HOSTNAME = "127.0.0.1";
    app.listen(config.PORT, HOSTNAME, () => {
        console.log(`http://${HOSTNAME}:${config.PORT}/`);
    });
} else if (config.COMPUTER === 1) {
    const HOSTNAME = "0.0.0.0";
    const HTTPS_DIR = '/www/wwwroot/czt666.cn/https';

    const privateKey = fs.readFileSync(path.join(HTTPS_DIR, 'czt666.cn.key'), 'utf8'); // 密钥
    const certificate = fs.readFileSync(path.join(HTTPS_DIR, 'czt666.cn.pem'), 'utf8'); // 公钥
    const caKey = fs.readFileSync(path.join(HTTPS_DIR, 'czt666.cn.pem'), 'utf8'); // 私钥
    const credentials = { key: privateKey, ca: [caKey], cert: certificate };
    const httpsServer = https.createServer(credentials, app); //创建https服务

    httpsServer.listen(config.PORT, HOSTNAME, () => {
        console.log(`https://${HOSTNAME}:${config.PORT}/`);
    });
}