var session = require('express-session')
const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')

const userController = require('./controllers/userController')
const textController = require('./controllers/textController')

app.use(express.urlencoded({ extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(session({ //Vão ter sessões diferentes entre aluno e prof.
    secret: 'Aluno',
    saveUninitialized: true, //No exemplo do Roger esta como TRUE
    resave: true
},{
    secret: 'Professor', //Mudar esse secret
    saveUninitialized: true, //No exemplo do Roger esta como TRUE
    resave: true
}))

//home
app.get('/', function(req,res){
    let name
    if(req.session.username){
        name = req.session.username
    } else {
        name = "convidado"
    } 
    res.render('home.ejs',{user: name})
})
//TUTORIAL | PASSO 01 | PASSO 02 | PASSO 03 | DOWNLOAD
app.get('/tutorial', function(req,res){ res.render('tutorial.ejs')}); 
app.get('/step01',function(req,res){res.render('./tutor_steps/step01.ejs')});
app.get('/step02',function(req,res){res.render('./tutor_steps/step02.ejs')});
app.get('/step03',function(req,res){res.render('./tutor_steps/step03.ejs')});
app.get('/download01', function(req,res){ res.download(__dirname + "/public/site_things/Download/redacao2019.pdf")})
app.get('/download02', function(req,res){ res.download(__dirname + "/public/site_things/Download/redacao2022.pdf")})

//usuario ambos 
app.get('/login',userController.login)
app.post('/login', userController.realizeLogin)

app.get('/register', function(req,res){
    res.render('./user/register.ejs')
})
app.post('/register', userController.storeUser)

app.get('/perfil', userController.perfil)

app.get('/editUser', function(req,res){
    res.render('./user/editUser.ejs')
})
app.post('/editUser', userController.edit)

app.get('/logout', userController.logout)

//texto e editor
app.get('/write',function(req,res){
    res.render('write.ejs')
}) 
app.post('/write', textController.write) //Quando terminar o texto e enviar, este é o método para inserir no banco

app.get('/textComplete',function(req,res){
    res.render('list.ejs')
}) //Vai pra listagem | Tem que modificar

app.listen(port, function(){
    console.log(`Funcinando na porta ${port}`)
})

