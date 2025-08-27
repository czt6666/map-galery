const db = require("../../src/db");

// 创建表并插入数据的函数
function createTableAndInsertData(jsonData, tableName) {
    // 如果 json 为 undefined 或 null，则返回空字符串
    if (!jsonData) {
        return "";
    }

    // 确保 json 是一个数组，并且至少包含一个对象
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        return "";
    }

    // 获取JSON数据的键
    const keys = Object.keys(jsonData[0]);
    console.log(`${tableName} 共有 ${keys.length + 1} 个列,${jsonData.length}个行`);

    // 构建创建表的SQL语句
    let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY, is_delete TINYINT(1) DEFAULT 0,`;

    // 根据JSON数据动态生成表的列，并根据值的类型确定列的数据类型
    keys.forEach((key, index) => {
        let type = "VARCHAR(255)"; // 默认数据类型为字符串

        // 检查键对应的值的类型，如果是数字，则设置列类型为INT
        if (typeof jsonData[0][key] === "number") {
            type = "INT";
        }

        createTableSQL += `${key} ${type}`;
        if (index < keys.length - 1) {
            createTableSQL += ", ";
        }
    });
    createTableSQL += ")";

    // 创建表
    db.query(createTableSQL, (error, results) => {
        if (error) return console.log("创建表失败", error);

        // 构建插入的sql
        const insertDataSQL = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES ?`;
        // 构建插入的值数组
        const values = jsonData.map((obj) =>
            keys.map((key) => {
                if (typeof obj[key] === "number") return obj[key];
                return obj[key].length ? obj[key] : null;
            })
        );

        db.query(insertDataSQL, [values], (error, results) => {
            if (error) return console.log("插入失败", error);
            console.log(`Mysql 写入成功，插入${results.affectedRows}条数据`);
        });
    });
}

module.exports = createTableAndInsertData;
