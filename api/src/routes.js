const express = require("express");
const router = express.Router();
const db = require("./util/queryDataBase");
const util = require("./util/index");
const config = require("../config");
const { photoCompress } = require("../scripts/photoCompress");

// 获取数据接口（示例）
router.get("/geturldata", async (req, res) => {
    const { database } = req.query;
    const tableNames = await util.normalizeTableNames(database);
    const data = await db.queryMutData(tableNames);
    const result = data.map((item) => ({
        gps: [Number(item.longitude), Number(item.latitude)],
        imgSrc: `http://${config.HOST}:${config.PORT}/upload/${item.relativePath}`,
        fileSize: item.fileSize,
        shotDate: item.shotDate,
        shotTime: item.shotTime,
        shotTimestamp: item.shotTimestamp,
        isAerialShot: item.isAerialShot,
        province: item.province,
        city: item.city,
        district: item.district,
    }));
    res.json(result);
});

router.get("/admin/upload", async (req, res) => {
    const { filePath, projectName } = req.query;
    console.log("上传文件信息:", { filePath, projectName });

    // 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
        const stream = photoCompress(filePath, projectName);
        for await (const log of stream) {
            res.write(`data: ${log}\n\n`); // SSE 格式
        }
        res.write(`data: ${JSON.stringify({ message: "文件上传成功" })}\n\n`);
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    } finally {
        res.end();
    }
});

module.exports = router;
