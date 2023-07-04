const mysql = require('mysql')
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TCC_prototype'
})

con.connect(function (err) {
    if (err) throw err
    var sql = "CREATE TABLE TB_users (id INT(6) AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40), email VARCHAR(100) UNIQUE, passwd VARCHAR(255), role TINYINT, image VARCHAR(255))"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_users criada!")
    })

    sql = "CREATE TABLE TB_texts (id INT(6) AUTO_INCREMENT PRIMARY KEY, title VARCHAR(225), institute VARCHAR(40), topic VARCHAR(255), redation MEDIUMTEXT, visible TINYINT, fk_user INT NOT NULL, FOREIGN KEY (fk_user) REFERENCES TB_users(id) )"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_texts criada!")
    })
    sql = "CREATE TABLE TB_comments (id INT(6) AUTO_INCREMENT PRIMARY KEY, comment TEXT, score INT, fk_user INT NOT NULL, FOREIGN KEY (fk_user) REFERENCES TB_users(id), fk_text INT NOT NULL, FOREIGN KEY (fk_text) REFERENCES TB_texts(id) )"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_comments criada!")
    })

    //VER EXEMPLO "CHAT" DOS SLIDES DO ROGER E USAR O ARQUIVO CHAT.JS
    sql = "CREATE TABLE TB_chat (id INT(6) AUTO_INCREMENT PRIMARY KEY, send_id INT , message VARCHAR(255), FOREIGN KEY (send_id) REFERENCES TB_users(id), recept_id INT(6) NOT NULL, FOREIGN KEY (recept_id) REFERENCES TB_users(id) )"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_chat criada!")
    })
})
