const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

const textModel = require('../models/user')
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
    }
}