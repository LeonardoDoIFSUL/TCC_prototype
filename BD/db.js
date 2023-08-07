const mysql = require("mysql");

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "TCC_prototype_newArch"
});

exports.pool = pool;