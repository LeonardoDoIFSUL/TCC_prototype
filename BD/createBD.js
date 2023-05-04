const mySQL = require('mysql')
const con = mySQL.createConnection({
    host:'localhost', //TEM QUE MUDAR ISSO PELO ENDEREÇO E CRIAR O BANCO REAL NO PC
    user: 'root', // SEMPRE LOGAR COMO ROOT
    password:'', //IMPLEMTENTAR ESSA SENHA NO BANCO
})

con.connect(function (err){
    if(err) throw err
    let sql = "CREATE DATABASE TCC_prototype"
    con.query(sql, function(err, result){
        if(err) throw err
        console.log("DataBase Criado com Sucesso")
    })
    con.end()
})