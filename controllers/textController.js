const bcrypt = require('bcrypt')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const userModel = require('../models/user')
const textModel = require('../models/text')
const { throws } = require('assert')


module.exports = {
    //Aqui vai todas as função que serão utilizadas pelas views e models

    index: async function (req, res) {
        var role;
        textModel.searchAllPodium() //Modificar essa query para cada texto e não todos juntos
            .then(result => {
                if (req.session.role != undefined) {
                    role = req.session.role
                } else {
                    role = 0
                }
                if (req.session.loggedin != undefined) {
                    res.render('podium', { dataText: result, role: role })
                } else {
                    req.session.err = "Você precisa estar logado para acessar o pódio"
                    res.redirect('/login')
                }

            })
    },

    indexUser: async function (req, res) {
        if (req.session.loggedin != undefined) {
            const id = req.session.user_id
            textModel.searchAllUser(id) //Criar essa função para buscar todos dentro da model
                .then(result => {
                    res.render('list', { dataText: result }) //Envia os dados da model chamando a view "list"
                })
                .catch(err => console.error(err))
        } else {
            req.session.err = "Voce deve estar logado para ver seu portifólio"
            res.redirect('/login')
        }
    },

    comment: function (req, res) {
        let id = req.params.id
        textModel.searchOne(id)
            .then(result => {
                res.render('write_comment', { dataText: result }) //Envia os dados da model chamando a view "list"
            })
    },

    commentCreate: function (req, res) { //Ver se isso ta correto, é pra passar o ID do texto
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields) => {
            if (err) throw err;
            var user_id = req.session.user_id
            var text_id = req.params.id
            textModel.createComment(fields['comment'], fields['score'], user_id, text_id) // Senao tiver tem que mudar aqui
            textModel.takeNotes(text_id)
                .then(result => {
                    if (result != undefined) {
                        var tot_score = 0
                        var media = 0
                        var score = []
                        result.forEach(function (data) {
                            score.push(data['score'])
                        })
                        for (let i = 0; i < score.length; i++) {
                            tot_score = tot_score + score[i]
                        }
                        media = (tot_score / score.length).toFixed(1)
                        textModel.updateNote(text_id, media)
                    }
                })
        })
        res.redirect('/podium')
    },

    showComments: function (req, res) {
        let text_id = req.params.id
        textModel.searchCommentText(text_id)
            .then(result => {
                res.render('comment', { dataComment: result })
            })
    },
//REVER DAQUI PARA BAIXO | LOGICA TA PRECARIA
    deleteComment: function (req, res) {
        let comment_id = req.params.id
        let text
        let text_infos
        textModel.searchOneText_By_CommentId(comment_id)
        .then(result=>{
            text = result[0]['fk_text']
            text_infos = result
        })
        textModel.deleteComment(comment_id)
        res.render(`/showcomments/${text}`, {dataComment: text, infos: text_infos})
    },

    read: function (req, res) {
        let text_id = req.params.id
        textModel.searchOne(text_id)
            .then(result => {
                res.render('read', { dataText: result })
            })
    },

    create: function (req, res) {
        var name;
        if (req.session.username)
            name = req.session.username;
        else
            name = null;
        if (req.session.loggedin) {
            res.render('write')
        }
        else {
            req.session.erro = true;
            req.session.message = "Por favor realize o login para criar uma redação" //Lembrar de criar um campo para mensagens de erro na view login
            res.redirect('/login')
        }
    },

    write: function (req, res) {
        var form = new formidable.IncomingForm(); //Tá com erro aqui, não entra no PARSE
        form.parse(req, (err, fields) => {
            if (err) throw err;
            var valuetion_zero = 0
            var user_id = req.session.user_id
            if (fields['visible'] == undefined) {
                fields['visible'] = 0;
            } else {
                fields['visible'] = 1;
            }
            textModel.create(fields['title'], fields['test'], fields['assunt'], fields['redation'], fields['visible'], valuetion_zero, user_id)
        })
        res.redirect('/list')
    },

    destroy: function (req, res) {
        var id = req.params.id;
        if (req.session.loggedin) { //Descobrir o por que de existir isso kkkk | é util eu juro
            textModel.delete(id)
            res.redirect('/list')
        }
    }


}