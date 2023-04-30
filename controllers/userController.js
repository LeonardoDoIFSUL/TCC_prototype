const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

const userModel = require('../models/user')
const { throws } = require('assert')


module.exports = {
  
    index: async function(req,res){
        textModel.searchAll() //Criar essa função para buscar todos dentro da model
        .then(result=>{
            res.render('/text/showText',{dadosText: result}) //Chama a view enviando os dados retornados pela model
        })
        .catch((e)=>{
            throws(e)
        })
    },
    create: function(req,res){
        var name 
        if(req.session.username)
        name = req.session.username
        else 
        name = null
        res.render('/register',{user: name})
    },
    newCreate: async function(){
        userModel.create(req.body['name'],req.body['email'],req.body['passwd'],req.body['choose'],req.body['image'])
        res.redirect('/login')
    }
}