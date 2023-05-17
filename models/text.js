const textController = require('../controllers/textController')
const con = require('../BD/db').pool

//Na model são criadas as operações que são realizadas no banco | CRUD
module.exports = {

    async searchAll() {
        const sql = "SELECT * FROM TB_texts";
        return new Promise((resolve, reject) => {
            con.query(sql, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    async searchAllUser(req) {
        const sql = "SELECT * FROM TB_texts WHERE fk_user = ?";
        const user_id = req.session.user_id
        return new Promise((resolve, reject) => {
            con.query(sql, user_id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    async searchOne(id) { 
        const sql = "SELECT * FROM TB_texts WHERE id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    async searchCommentText(id) { 
        const sql = "SELECT * FROM TB_comments WHERE fk_text = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    create: function (title, test, assunt, redation, user_id) {
        let sql = "INSERT INTO TB_texts(title, institute, topic, redation, fk_user) VALUES ?"
        let values = [
            [title, test, assunt, redation, user_id]
        ]
        con.query(sql, [values], function (err, result) {
            if (err) throw err
            console.log("Número de registros inseridos: ", result.affectedRows)
        })
    },

    delete: function (id) {
        let sql = "DELETE FROM TB_texts WHERE id = ?"
        con.query(sql, id, function (err, result) {
            if (err) throw err
            console.log("Numero de registros Apagados: ", result.affectedRows);
        })
    },

    createComment: function(comment, score, fk_user, fk_text){
        let sql = "INSERT INTO TB_comments(comment, score, fk_user, fk_text) VALUES ?"
        //let fk_user = req.session.user_id O CÓDIGO ESTA TRAVANDO AQUI | Não ta chegando o user_id
        let values = [
            [comment, score, fk_user, fk_text]
        ]
        con.query(sql, [values], function(err, result){
            if(err) throw err
            console.log("Numero de linhas Comentadas: ", result.affectedRows);
        })
    }

}