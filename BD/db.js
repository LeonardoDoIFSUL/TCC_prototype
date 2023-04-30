const mysql = require("mysql");

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "TCC_prototype"
});

exports.pool = pool;