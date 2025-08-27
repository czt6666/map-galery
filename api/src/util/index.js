const config = require("../../config");
const db = require("../db");

function normalizeTableNames(database) {
    let tableNames = database;
    if (!Array.isArray(tableNames)) {
        tableNames = [tableNames];
    }
    // 过滤出在config中存在的表名
    const existingTableNames = tableNames.filter((tableName) => config.tableNames.includes(tableName));
    // 没有参数
    if (!existingTableNames || existingTableNames.length === 0) {
        return config.tableNames;
    }

    return existingTableNames;
}

async function getAllTableNames(database) {
    const [rows] = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = ?", [
        database,
    ]);
    return rows.map((row) => row.TABLE_NAME);
}

module.exports = {
    normalizeTableNames,
};
