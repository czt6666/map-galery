const express = require("express");
const router = express.Router();
const db = require("./util/queryDataBase");
const util = require("./util/index");
const { photoCompress } = require("../scripts/photoCompress");

// 获取数据接口（示例）
router.get("/geturldata", async (req, res) => {
    const { database } = req.query;
    const tableNames = util.normalizeTableNames(database);
    const data = await db.queryMutData(tableNames);
    const result = data.map((item) => ({
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
    }));
    res.json(result);
});

router.get("/admin/upload", async (req, res) => {
    const { filePath, projectName } = req.query;
    console.log("上传文件信息:", { filePath, projectName });

    // await photoCompress(filePath, projectName);
    // 处理文件上传逻辑
    res.json({ message: "文件上传成功" });
});

module.exports = router;
