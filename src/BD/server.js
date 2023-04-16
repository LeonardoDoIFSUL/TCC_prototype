const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
var session = require('express-session')
const express = require('express')
const app = express()

app.use(express.static('../public'))
app.set('view engine','ejs')
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    saveUninitialized: false, //No exemplo do Roger esta como TRUE
    resave: false
}))


const mySQL = require('mysql')
const con = mySQL.createConnection({
    host:'localhost', //TEM QUE MUDAR ISSO E CRIAR O BANCO REAL NO PC
    user: 'root', // SEMPRE LOGAR COMO ROOT
    password:'1805', //IMPLEMTENTAR ESSA SENHA NO BANCO
    database: 'TCC_prototype' //USAR ESTE NOME
})

con.connect(function(err){
    if(err) throw err
    console.log('Conectado!')
})

