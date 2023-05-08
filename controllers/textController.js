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
        textModel.searchAll() //Criar essa função para buscar todos dentro da model
        .then(result=>{
            res.render('../views/list',{dadosText: result}) //Envia os dados da model chamando a view "list"
        })
        .catch((e)=>{
            throws(e)
        })
    },
    write: ()=>{
        //Fazer inclusões para enviar o conteudo para a model
    }
}