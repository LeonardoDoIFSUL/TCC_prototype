const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

const textModel = require('../models/text')
const { throws } = require('assert')


module.exports = {
    //Aqui vai todas as função que serão utilizadas pelas views e models

    index: async function(req,res){
        let role;
        textModel.searchAll() //Criar essa função para buscar todos dentro da model
        .then(result=>{
            if(req.session.role){
            role = req.session.role
            } else {
            role = 0
            }
            console.log(result)
            res.render('podium',{dataText: result, role: role}) //Envia os dados da model chamando a view "list"
        })
    },

    indexUser: async function(req,res){
        if(req.session.loggedin){
        textModel.searchAllUser(req) //Criar essa função para buscar todos dentro da model
        .then(result=>{
            res.render('list',{dataText: result}) //Envia os dados da model chamando a view "list"
        })
    } else{
        let error = "Voce deve estar logado para ver seu portifólio"
        res.redirect('/login', error)
    }
    },

    comment: function(req, res){
        let id = req.params.id
        textModel.searchOne(id) //Criar essa função para buscar todos dentro da model
        .then(result=>{
            res.render('write_comment',{dataText: result}) //Envia os dados da model chamando a view "list"
        })
    },

    commentCreate: function(req,res){ //Ver se isso ta correto, é pra passar o ID do texto
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields) => {
            if(err) throw err;
            var user_id = req.session.user_id
            var text_id = req.params.id
            textModel.createComment(fields['comment'],fields['score'], user_id, text_id) // Senao tiver tem que mudar aqui
        })
        res.redirect('/podium')
    },

    showComments:  function(req,res){
        let text_id = req.params.id
        textModel.searchCommentText(text_id)
        .then(result=>{
            res.render('comment',{dataComment: result})
        })
    },

    read: function(req,res){
        let text_id = req.params.id
        textModel.searchOne(text_id)
        .then(result=>{
            res.render('read', {dataText: result})
        })
    },

    create: function(req,res){
        var name;
        if(req.session.username)	
            name = req.session.username;
        else 
            name = null;
        if (req.session.loggedin) {
            res.render('write')
        }
        else{
            req.session.erro=true;
            req.session.message = "Por favor realize o login para criar uma redação" //Lembrar de criar um campo para mensagens de erro na view login
            res.redirect('/login')
        }
    },

    write: function(req,res){
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields) => {
            if(err) throw err;
            var user_id = req.session.user_id
            textModel.create(fields['title'],fields['test'],fields['assunt'], fields['redation'], user_id)
        })
        res.redirect('/list')
    },

    destroy: function(req,res){
        var id= req.params.id;
        if (req.session.loggedin) {
            textModel.searchOne(id) //Descobrir o por que de existir isso kkkk | é util eu juro
            textModel.delete(id)
            res.redirect('/list')
        }
    }


}