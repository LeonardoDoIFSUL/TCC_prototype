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
        textModel.searchAllUser(req) //Criar essa função para buscar todos dentro da model
        .then(result=>{
            res.render('list',{dataText: result}) //Envia os dados da model chamando a view "list"
        })
    },

    comment: function(id){
        //FAZER A PARTE DE COMENTARIOS DOS PROFESSORES PRIMEIRO
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