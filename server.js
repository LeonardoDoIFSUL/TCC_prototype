var session = require('express-session')
const express = require('express')
const app = express()
const port = 8080

app.use(express.static('../public'))
app.set('view engine','ejs')

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    saveUninitialized: false, //No exemplo do Roger esta como TRUE
    resave: false
}))

const textController = require('./src/controllers/textController')
app.get('/text', textController.create)

const userController = require('./src/controllers/userController')
app.get('/user', userController) //Aqui tem que adicionar um parametro como create, edit, show, etc...

app.listen(port, function(){
    console.log(`Funcinando na porta ${port}`)
})

