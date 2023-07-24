var session = require('express-session')
var path = require('path')
const express = require('express')
const app = express()
const port = 3000

const userController = require('./controllers/userController')
const textController = require('./controllers/textController')

app.use(express.urlencoded({ extended:true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine','ejs')
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    saveUninitialized: true, 
    resave: true
}))

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//home
app.get('/', userController.index)

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

app.get('/perfil', userController.perfil) //TEM QUE CONSERTAR ESSA ROTA

app.get('/deleteUser', userController.deleteUser)

app.get('/edit', userController.edit)
app.post('/edit', userController.update)

app.get('/logout', userController.logout)

//CHAT
app.get('/evaluetor', userController.showEvaluetors)
app.get('/evaluetor/:page', userController.showEvaluetors_pages) //Paginação

app.get('/studant', userController.showStudants)
app.get('/studant/:page', userController.showStudants_pages) //Paginação

app.post('/chat', userController.access)

app.post('/recept', userController.recept)
app.post('/searchMessage', userController.searchMessage)

//texto e editor
app.get('/readRedation/:id', textController.read)

app.get('/write', textController.create) 
app.post('/write', textController.write) //Quando terminar o texto e enviar, este é o método para inserir no banco

app.get('/list', textController.indexUser)

app.get('/comment/:id', textController.comment) 
app.post('/comment/:id', textController.commentCreate)

app.get('/showcomments/:id',textController.showComments)

app.get('/deleteComments/:id',textController.deleteComment)

app.get('/delete/:id', textController.destroy)

app.get('/podium', textController.index)

app.listen(port, function(){
    console.log(`Funcinando na porta ${port}`)
})
