const jwt = require("jsonwebtoken");
const config = require("../config");

// 权限中间件
function authMiddleware(req, res, next) {
    // 开放接口白名单（不需要校验）
    const whiteList = ["/api/login", "/api/public"];

    if (whiteList.includes(req.path)) {
        return next();
    }

    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "未授权：缺少 Token" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), config.JWT_SECRET);
        req.user = decoded; // 挂载用户信息，后续可用于权限判断
        next();
    } catch (err) {
        return res.status(401).json({ message: "无效的 Token" });
    }
}

// 全局错误处理
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ message: "服务器内部错误", error: err.message });
}

module.exports = { authMiddleware, errorHandler };
