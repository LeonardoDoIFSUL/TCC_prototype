const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')

const userModel = require('../models/user')
const { throws } = require('assert')
const IncomingForm = require('formidable/Formidable')


module.exports = {

    index: async function (req, res) {
        textModel.searchAll() //Criar essa função para buscar todos dentro da model
            .then(result => {
                res.render('/text/showText', { dadosText: result }) //Chama a view enviando os dados retornados pela model
            })
            .catch((e) => {
                throws(e)
            })
    },
    create: function (req, res) {
        var name
        if (req.session.username)
            name = req.session.username
        else
            name = null
        res.render('../views/register', { user: name }) //Verificar se caminho esta correto
    },
    storeUser: function (req, res) {
        let form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
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
    }
}