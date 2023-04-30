var session = require('express-session')
const express = require('express')
const app = express()
const port = 8080

app.use(express.static('public'))
app.set('view engine','ejs')

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    saveUninitialized: false, //No exemplo do Roger esta como TRUE
    resave: false
}))

app.get('/', function(req,res){
    let name
    if(req.params.name){
        name = req.params.name
    } else {
        name = null
    } 
    res.render('home.ejs',{user: name})
})

app.get('/login', function(req,res){
    res.render('./user/login.ejs')
})

app.get('/register', function(req,res){
    res.render('./user/register.ejs')
})

const userController = require('./controllers/userController')
app.post('/register', userController.create)//Aqui tem que adicionar um parametro como create, edit, show, etc...

app.get('/editor', function(req,res){
    res.render('editor.ejs')
})

const textController = require('./controllers/textController')
app.get('/text', textController.create)

app.listen(port, function(){
    console.log(`Funcinando na porta ${port}`)
})

