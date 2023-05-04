const mysql = require('mysql')
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'TCC-prototype'
})

con.connect(function (err) {
    if (err) throw err
    var sql = "CREATE TABLE TB_users (id INT(6) AUTO_INCREMENT PRIMARY KEY UNSIGNED, name VARCHAR(40), email VARCHAR(100) UNIQUE, passwd (255), role BIT NOT NULL, image VARCHAR(255))"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_users criada!")
    })

    sql = "CREATE TABLE TB_texts (id INT(6) AUTO_INCREMENT PRIMARY KEY UNSIGNED, title VARCHAR(225), institute VARCHAR(40), topic VARCHAR(255), time TIMESTAMP, id_user INT(6) UNSIGNED,FOREIGN KEY (id_user) REFERENCES TB_users(id) )"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_texts criada!")
    })
    sql = "CREATE TABLE TB_comments (id INT(6) AUTO_INCREMENT PRIMARY KEY UNSIGNED, comment TEXT, score INT, id_user INT UNSIGNED, FOREIGN KEY (id_user) REFERENCES TB_users(id), id_text INT(6) UNSIGNED, FOREIGN KEY (id_text) REFERENCES TB_texts(id))"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_comments criada!")
    })

    //VER EXEMPLO "CHAT" DOS SLIDES DO ROGER E USAR O ARQUIVO CHAT.JS
    sql = "CREATE TABLE TB_chat (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, send_id INT UNSIGNED, message VARCHAR(255), FOREIGN KEY (send_id) REFERENCES TB_users(id), recept_id INT(6) UNSIGNED, FOREIGN KEY (recept_id) REFERENCES TB_users(id))"
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("TB_chat criada!")
    })
})
