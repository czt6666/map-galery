const mysql = require("mysql2");
const config = require("../../config");

let user = "root";
let password = "123456";

if (config.COMPUTER) {
    user = config.mysql_user;
    password = config.mysql_password;
}

const db = mysql.createPool({
    host: "127.0.0.1",
    user: user,
    password: password,
    database: config.database,
});

module.exports = db;
