const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

const userModel = require('../models/user')
const { throws } = require('assert')


module.exports = {

    login: function(req, res) {
        var name;
        if(req.session.username)	
            name = req.session.username;
        else 
            name = null;
        var message;
        if (req.session.erro) {
            message = req.session.mensagem;
            req.session.erro=false;
        }
        else{
            message = "Realizar Login";
        }
        res.render('./user/login.ejs', {message: message, user: name});
    },

    realizeLogin: async function(req, res) {
        let form = new formidable.IncomingForm()
        form.parse(req, (err,fields)=>{
            if(err) throw err
            userModel.login(fields['email'],fields['passwd'])
            .then(result=>{
                if(result){
                    req.session.loggedin = true
                    req.session.username = fields['email']
                res.redirect('/')
            } else {
                res.redirect('/login')
            }
        })
        })},

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

    perfil: async function(req,res){
        res.render('./user/perfil.ejs')
    },

    edit: function () {
        // Quase igual ao "storeUser" mas é diferente
    },
    logout: function (req, res) {
        req.session.destroy(function (err) {
            if (err) console.log("DEU ERRO NO LOGOUT", err)
        })
        res.redirect('/login');
    }
}