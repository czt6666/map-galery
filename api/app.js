// app.js
const express = require("express");
const https = require("https");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const config = require("./config");
const routes = require("./src/routes");
const { authMiddleware, errorHandler } = require("./src/middleware");

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static(path.join(__dirname, "./upload")));

// 权限校验中间件（在路由之前）
app.use(authMiddleware);

// 路由
app.use("/api", routes);

// 全局错误处理
app.use(errorHandler);

// 监听端口
if (config.COMPUTER === 0) {
    const HOSTNAME = "127.0.0.1";
    app.listen(config.PORT, HOSTNAME, () => {
        console.log(`http://${HOSTNAME}:${config.PORT}/`);
    });
} else if (config.COMPUTER === 1) {
    const HOSTNAME = "0.0.0.0";
    const HTTPS_DIR = "/www/wwwroot/czt666.cn/https";

    const privateKey = fs.readFileSync(path.join(HTTPS_DIR, "czt666.cn.key"), "utf8");
    const certificate = fs.readFileSync(path.join(HTTPS_DIR, "czt666.cn.pem"), "utf8");
    const caKey = fs.readFileSync(path.join(HTTPS_DIR, "czt666.cn.pem"), "utf8");

    const credentials = { key: privateKey, ca: [caKey], cert: certificate };
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(config.PORT, HOSTNAME, () => {
        console.log(`https://${HOSTNAME}:${config.PORT}/`);
    });
}
