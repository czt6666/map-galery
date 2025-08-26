const fs = require('fs');
const wrightMysql = require('./wrightMysql')

// 读取 JSON 文件内容
fs.readFile('D:/阿巴阿巴/照片/219test.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file: ' + err);
        return;
    }

    // 解析 JSON 数据
    const jsonData = JSON.parse(data);

    // 插入数据到数据库
    wrightMysql(jsonData, '219dbtest');
});
