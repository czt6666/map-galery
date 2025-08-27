const db = require("../db");

async function normalizeTableNames(database) {
    // 获取当前数据库下所有 tb 开头的表名
    const validTableNames = await getTbTables();
    console.log("Valid table names:", validTableNames);

    let tableNames = database;
    if (!Array.isArray(database)) {
        tableNames = [database];
    }

    // 过滤出数据库中存在的表名
    tableNames = tableNames.filter((tableName) => validTableNames.includes(tableName));

    // 如果没有参数或过滤后为空，返回所有有效表名
    if (!tableNames || tableNames.length === 0) {
        return validTableNames;
    }

    return tableNames;
}

async function getTbTables() {
    // 查询所有 tb 开头的表
    const [tables] = await db.promise().query(
        `SELECT table_name 
         FROM information_schema.tables 
         WHERE table_schema = 'map_gallery' 
           AND table_name LIKE 'tb%'`
    );

    // 返回 table_name 数组
    return tables.map((row) => row.TABLE_NAME);
}

module.exports = {
    normalizeTableNames,
};
