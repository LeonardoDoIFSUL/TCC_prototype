const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const con = require('../BD/db').pool //TEM QUE TIRAR ISSO QUANDO AJEITAR O CÓDIGO DE CHAT PARA A MODEL
const userModel = require('../models/user')
const { throws } = require('assert')


module.exports = {

    index: function(req,res){
        let name
        let role
        if(req.session.username){
            name = req.session.username
            role = req.session.role
        } else {
            name = "convidado"
            role = -1
        } 
        
        res.render('home',{user: name, role: role}) 
    },

    login: function (req, res) {
        var name;
        if (req.session.username)
            name = req.session.username;
        else
            name = null;
        var message;
        if (req.session.err) {
            message = req.session.err;
            req.session.err = true;
        }
        else {
            message = "Realizar Login";
        }
        res.render('./user/login', { message: message, user: name}); 
    },

    realizeLogin: async function (req, res) {
        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields) => {
            if (err) throw err
            userModel.login(fields['email'], fields['passwd'])
                .then(result => {
                    if (result) {
                        req.session.loggedin = true
                        req.session.username = result.name
                        req.session.image = result.image
                        req.session.role = result.role
                        req.session.user_id = result.id
                        res.redirect('/')
                    } else {
                        res.redirect('/login')
                    }
                })
        })
    },

    storeUser: function (req, res) {
        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
            if (err) throw err
            let oldpath = files.image.filepath
            let hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
            let nameImg = hash + "." + files.image.mimetype.split('/')[1]
            let newpath = path.join(__dirname, '../public/images/', nameImg)
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err
            })
            userModel.create(fields['name'], fields['email'], fields['passwd'], fields['role'], nameImg)
        })
        res.redirect('/login')
    },

    perfil: async function (req, res) {
        if (req.session.loggedin) {
            var id = req.session.user_id
            userModel.searchOne(id)
                .then(result => {
                    if(result[0]['role'] == 0){
                        result[0]['role'] = "Aluno"
                    } else {
                        result[0]['role'] = "Professor"
                    }
                    res.render('./user/perfil', {dataUser: result})
                })
                .catch(err=>{
                    console.error(err)
                })
        } else {
            req.session.err = "Você precisa estar logado para acessar o seu perfil"
            res.redirect('/login', {message: req.session.err})
        }
    },

    edit: async function (req, res) {
        var name;
        if (req.session.username)
            name = req.session.username;
        else{
            name = null;
        }
        if (req.session.loggedin) {
            var id = req.session.user_id
            userModel.searchOne(id)
                .then(result => {
                    if(result[0]['role'] == 0){
                        result[0]['role'] = "Aluno"
                    } else {
                        result[0]['role'] = "Professor"
                    }
                    res.render('./user/edit', {dataUser: result})
                })
                .catch(err => {
                    console.error(err)
                })
        }
        else {
            req.session.err = true
            req.session.message = "Por favor realize o login para concluir esta operação"
            res.redirect('/login')
        }
    },

    update: function (req, res) {
        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
            let id = req.session.user_id
            let name = fields['name']
            let email = fields['email']
            let image = files.image.size //VERIFICA SE VEIO FOTO OU NÃO
            if(image == 0){
                userModel.attNoImg(id,name,email) //Ver se isso ta correto
            } else {
            let oldpath = files.image.filepath
            let hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
            let nameImg = hash + "." + files.image.mimetype.split('/')[1]
            let newpath = path.join(__dirname, '../public/images/', nameImg)
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err
            })
                userModel.attWithImg(id,name,email,nameImg) //Ver se isso ta correto
            }
            res.redirect('/perfil')
        })
    },

    logout: function (req, res) {
        req.session.destroy(function (err) {
            if (err) console.log("DEU ERRO NO LOGOUT", err)
        })
        res.redirect('/login');
    },

    deleteUser: async function(req,res){
        var id = req.session.user_id
        userModel.deletePhoto(id)
        .then(result=>{
            var img = path.join(__dirname, '../public/images/', result[0]['image'])
            fs.unlink(img, (err)=>{})
            return result[0]['id']
        })
        .then(result=>{
            userModel.delete(result)
            res.redirect('/logout')
        })

        .catch(err=>
            console.error(err)
            );
    },
    

    //CHAT ENTRE ESTUDANTES | AVALIADORES
    showStudants: function (req, res) {
        if (req.session.loggedin) {
            //Este código tem paginação, tem que mudar isso caso não use BOOTSTRAP
            let perpage = 8
            let page = 0
            let user = req.session.username
            let user_id = req.session.user_id
            let user_role = 0 //Código do aluno no banco
            let sql = "SELECT * FROM TB_users WHERE role = ? ORDER BY ID ASC LIMIT ? OFFSET ?"
            count = "SELECT COUNT(*) AS number FROM TB_users"
            con.query(count, function (err, result2, fields) {
                if (err) throw err;
                con.query(sql, [user_role, perpage, page], function (err, result, fields) {
                    if (err) throw err;
                    pages = Math.ceil(result2[0]['number'] / perpage)
                    res.render('./chat/show_users', { dataUsers: result, user: user, user_id: user_id, current: page + 1, pages: pages })
                })
            })
        } else {
            req.session.err = "Por favor faça login para acessar esta pagina"
            res.redirect('/login')
        }
    },

    showStudants_pages: function (req, res) {
        if (req.session.loggedin) {
            //Este código tem paginação, tem que mudar isso caso não use BOOTSTRAP
            let perpage = 8
            let page = parseInt(req.params.page) - 1
            page = page * perpage
            let user = req.session.username
            let user_id = req.session.user_id
            let user_role = 0 //Código do aluno no banco
            let sql = "SELECT * FROM TB_users WHERE role = ? ORDER BY ID ASC LIMIT ? OFFSET ?"
            count = "SELECT COUNT(*) AS number FROM TB_users"
            con.query(count, function (err, result2, fields) {
                if (err) throw err;
                con.query(sql, [user_role, perpage, page], function (err, result, fields) {
                    if (err) throw err;
                    pages = Math.ceil(result2[0]['number'] / perpage)
                    res.render('./chat/show_users', { dataUsers: result, user: user, user_id: user_id, current: page + 1, pages: pages })
                })
            })
        } else {
            req.session.err = "Por favor faça login para acessar esta pagina"
            res.redirect('/login')
        }
    },

    showEvaluetors: function (req, res) {
        if (req.session.loggedin) {
            //Este código tem paginação, tem que mudar isso caso não use BOOTSTRAP
            let perpage = 8
            let page = 0
            let user = req.session.username
            let user_id = req.session.user_id
            let user_role = 1 //Código do avaliador no banco
            let sql = "SELECT * FROM TB_users WHERE role = ? ORDER BY ID ASC LIMIT ? OFFSET ?"
            count = "SELECT COUNT(*) AS number FROM TB_users"
            con.query(count, function (err, result2, fields) {
                if (err) throw err;
                con.query(sql, [user_role, perpage, page], function (err, result, fields) {
                    if (err) throw err;
                    pages = Math.ceil(result2[0]['number'] / perpage)
                    res.render('./chat/show_evaluetors', { dataUsers: result, user: user, user_id: user_id, current: page + 1, pages: pages })
                })
            })
        } else {
            req.session.err = "Por favor faça login para acessar esta pagina"
            res.redirect('/login')
        }
    },

    showEvaluetors_pages: function (req, res) {
        if (req.session.loggedin) {
            //Este código tem paginação, tem que mudar isso caso não use BOOTSTRAP
            let perpage = 8
            let page = parseInt(req.params.page) - 1
            page = page * perpage
            let user = req.session.username
            let user_id = req.session.user_id
            let user_role = 1 //Código do aluno no banco
            let sql = "SELECT * FROM TB_users WHERE role = ? ORDER BY ID ASC LIMIT ? OFFSET ?"
            count = "SELECT COUNT(*) AS number FROM TB_users"
            con.query(count, function (err, result2, fields) {
                if (err) throw err;
                con.query(sql, [user_role, perpage, page], function (err, result, fields) {
                    if (err) throw err;
                    pages = Math.ceil(result2[0]['number'] / perpage)
                    res.render('./chat/show_evaluetors', { dataUsers: result, user: user, user_id: user_id, current: page + 1, pages: pages })
                })
            })
        } else {
            req.session.err = "Por favor faça login para acessar esta pagina"
            res.redirect('/login')
        }
    },

    access: function (req, res) {
        if (req.session.loggedin != undefined){
            let user = req.session.username
            let user_id = req.session.user_id
            let image = req.session.image
            req.session.converse_id = req.body['id']
            let converse_id = req.body['id']
            res.render('chat', { image: image, user: user, user_id: user_id, converse_id: converse_id })
        } else {
            req.session.err = "Por favor faça login para acessar esta pagina"
            res.redirect('/login', )
        }
    },

    recept: function (req, res) {
        user = req.session.user_id
        converse = req.session.converse_id
        let sql = "INSERT INTO TB_chat(send_id, message, recept_id) VALUES ?" //Tem que ver se o campo esta com esse nome no banco
        let values = [
            [user, req.body['message'], converse]
        ]
        con.query(sql, [values], function (err, result) {
            if (err) throw err
            console.log('Numero de mensagens enviadas', result.affectedRows)
        })
        res.send('Mensagem Enviada')
    },

    searchMessage: function (req, res) {
        user = req.session.user_id
        image = req.session.image
        converse = req.session.converse_id
        feedback = ""
        let sql = "SELECT * FROM TB_users WHERE id = ? ORDER BY id;"
        con.query(sql, converse, function (err, result, fields) {
            if (err) throw err
            image_converse = result[0]['image']
            values = [user, converse, converse, user]
            sql2 = "SELECT * FROM TB_chat WHERE (send_id=? && recept_id=?) or (send_id=? && recept_id=?) ORDER BY id LIMIT 100;"
            con.query(sql2, values, function (err, messages, fields) {
                if (err) throw err
                messages.forEach(function (data) {
                    if (user == data['send_id']) {
                        feedback = feedback + "<div class='media media-chat media-chat-reverse'>" +
                            "<img class='avatar' src='images/" + image + "'>" +
                            "<div class='media-body'>" +
                            "<p>" + data['message'] + "</p>" +
                            "</div>" +
                            "</div>" +
                            "<div class='media media-meta-day'> </div>"
                    } else {
                        feedback = feedback + "<div class='media media-chat'>" +
                            "<img class='avatar' src='imagens/" + image_converse + "'>" +
                            "<div class='media-body'>" +
                            "<p>" + data['message'] + "</p>" +
                            "</div>" +
                            "</div>" +
                            "<div class='media media-meta-day'> </div>"
                    }
                })
                res.send(JSON.stringify(feedback))
            })
        })

    }
}