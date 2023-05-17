const textController = require('../controllers/userController')
const bcrypt = require('bcrypt')
const con = require('../BD/db').pool
const saltRounds = 10


//Na model são criadas as operações que são realizadas no banco | CRUD
module.exports = {
    async searchAll() {
        const sql = "SELECT * FROM TB_users"
        return Promise((resolve, reject) => {
            con.query(sql, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    async searchOne(id) {
        const sql = "SELECT * FROM TB_users WHERE id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    login: async function (email, passwd) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM TB_users where email = ?"
            let login
            let data
            con.query(sql, [email], (err, result) => {
                if (err) return reject(err)
                if (result.length) {
                    login = bcrypt.compareSync(passwd, result[0]['passwd'])
                    data = result[0]
                    if (login) {
                        resolve(data)
                    }
                }
                else
                    login = false
                resolve(login)
            })
        })
    },

    create: function (name, email, passwd, role, image) {
        bcrypt.hash(passwd, saltRounds, function (err, hash) {
            if (err) throw err
            let sql = "INSERT INTO TB_users (name,email,passwd,role,image) VALUES ?"
            let values = [[name, email, hash, role, image]]

            con.query(sql, [values], function (err, result) {
                if (err) throw err
                console.log("Usuario incluido com sucesso! ->", result.affectedRows)
            })
        })
    },

    attNoImg: function (id, name, email) {
        var sql = "UPDATE TB_users SET name = ?, email = ? WHERE id = ?"
        var values = [
            [name], [email], [id]
        ]
        con.query(sql, values, function (err, result) {
            if (err) throw err
            console.log('Usuario modificado com sucesso! ->', result.affectedRows)
        })
    },

    attWithImg: function (id, name, email, image) { //TEM QUE MODIFICAR PARA APAGAR A FOTO ANTERIOR
        var sql = "UPDATE TB_users SET name = ?, email = ?, image = ? WHERE id = ?"
        var values = [
            [name], [email], [image], [id]
        ]
        con.query(sql, values, function (err, result) {
            if (err) throw err
            console.log('Usuario modificado com sucesso! ->', result.affectedRows)
        })
    },

    deletePhoto: async function (id) { //TA COM ERRO | entra e executa este trecho de código, mas dá erro no ID quando vai deletar User
        const sql = "SELECT * FROM TB_users WHERE id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    delete: async function (id) { //TA COM ERRO AQUI | não entra nem executa este trecho de código erro no ID
        let sql = "SELECT * FROM TB_texts WHERE fk_user = ?"
        var values = [
            [id]
        ]
        var pivot;
        con.query(sql, values, function (err, result) {
            if (err) { }
            pivot = result
            console.log(pivot)
            if (pivot[0] != undefined) {
                console.log("Texto selecionado com sucesso")
                let sql2 = "DELETE FROM TB_comments WHERE fk_text = ?"
                con.query(sql2, pivot[0]['id'], function (err2, result2) {
                    if (err2) { }
                    if (result2.affectedRows)
                        console.log("Comentarios deletados com sucesso", result2.affectedRows)
                })
            }
            let sql3 = "DELETE FROM TB_texts WHERE fk_user = ?"
            let values3 = [[id]]
            con.query(sql3, [values3], function (err3, result3) {
                if (err3) { }
                console.log("Textos deletados com sucesso", result3.affectedRows)

                let values5 = [
                    [id], [id]
                ]
                let sql5 = "DELETE FROM TB_chat WHERE (send_id = ?) OR (recept_id = ?)"
                con.query(sql5, values5, function (err5, result5) {
                    if (err5){ }
                    console.log("Chats deletados com sucesso", result5.affectedRows)

                    let sql4 = "DELETE FROM TB_users WHERE id = ?"
                    let values4 = [[id]]
                    con.query(sql4, [values4], function (err4, result4) {
                        if (err4) {console.log(err4)}
                        console.log("Usuario deletado com sucesso", result4.affectedRows)

                    })
                })
            })
        })
    }
}