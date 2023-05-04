var session = require('express-session')
const express = require('express')
const app = express()
const port = 8080

const userController = require('./controllers/userController')
const textController = require('./controllers/textController')

app.use(express.static('public'))
app.set('view engine','ejs')

app.use(session({ //Vão ter sessões diferentes entre aluno e prof.
    secret: '2C44-4D44-WppQ38S',
    saveUninitialized: false, //No exemplo do Roger esta como TRUE
    resave: false
}))

//home
app.get('/', function(req,res){
    let name
    if(req.params.name){
        name = req.params.name
    } else {
        name = null
    } 
    res.render('home.ejs',{user: name})
})

//usuario ambos 
app.get('/login', function(req,res){
    res.render('./user/login.ejs')
})

app.get('/register', function(req,res){
    res.render('./user/register.ejs')
})
app.post('/register', userController.storeUser)

app.get('/perfil', function(req,res){
    res.render('./user/perfil.ejs')
})

app.get('/editUser', function(req,res){
    res.render('./user/editUser.ejs')
})
app.post('/editUser', userController.edit)

app.get('/logout', userController.logout)

//texto e editor
app.get('/write',function(req,res){
    res.render('write.ejs')
}) 

app.get('/textComplete',function(req,res){
    res.render('list.ejs')
}) //Vai pra listagem | Tem que modificar
app.post('/textComplete', textController.create) //Quando terminar o texto e enviar, este é o método para inserir no banco

app.listen(port, function(){
    console.log(`Funcinando na porta ${port}`)
})

