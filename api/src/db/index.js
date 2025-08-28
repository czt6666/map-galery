const mysql = require("mysql2");
const config = require("../../config");

let user = "root";
let password = "123456";
let port = 3306;

if (config.COMPUTER) {
    user = config.mysql.user;
    password = config.mysql.password;
    port = config.mysql.port;
}

const db = mysql.createPool({
    host: "127.0.0.1",
    port,
    user: user,
    password: password,
    database: config.mysql.database,
});

module.exports = db;
