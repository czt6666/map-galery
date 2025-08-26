const config = require('../config')

function normalizeTableNames(database) {
    let tableNames = database
    if (!Array.isArray(tableNames)) {
        tableNames = [tableNames]
    }
    // 过滤出在config中存在的表名
    const existingTableNames = tableNames.filter(tableName => config.tableNames.includes(tableName));
    // 没有参数
    if (!existingTableNames || existingTableNames.length === 0) {
        return config.tableNames
    }

    return existingTableNames;
}

module.exports = {
    normalizeTableNames
}
