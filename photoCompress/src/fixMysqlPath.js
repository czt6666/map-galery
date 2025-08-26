const mysql = require('mysql');
const config = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'map_gallery'
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('连接数据库时出错：', err);
        return;
    }

    console.log('已成功连接到数据库');

    connection.query('SELECT * FROM 225guangxi', (err, results) => {
        if (err) {
            console.error('查询数据时出错：', err);
            return;
        }

        console.log('查询到的数据：', results);

        results.forEach((row) => {
            const updatedPath = `/广西照片225${row.relativePath}`;
            console.log(updatedPath);
            connection.query('UPDATE 225guangxi SET relativePath = ? WHERE id = ?', [updatedPath, row.id], (err, updateResults) => {
                if (err) {
                    console.error('更新数据时出错：', err);
                    return;
                }
                console.log('已更新数据：', updateResults);
            });
        });

        console.log('所有数据已更新');
        connection.end();
    });
});
