const textController = require('../controllers/textController')
const con = require('../BD/db').pool

//Na model são criadas as operações que são realizadas no banco | CRUD
module.exports = {

    async searchAll() { // Seleciona tudo
        const sql = "SELECT * FROM TB_texts";
        return new Promise((resolve, reject) => {
            con.query(sql, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    async searchAllPodium() { // Seleciona todos os visiveis no pódio
        const sql = "SELECT * FROM TB_texts where visible = 1 ORDER BY num_media DESC";
        return new Promise((resolve, reject) => {
            con.query(sql, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    async searchAllUser(id) {
        const sql = "SELECT * FROM TB_texts WHERE fk_user = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
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

    async searchOneText_By_CommentId(id) {
        const sql = "SELECT * FROM TB_comments WHERE id = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },
//RESULVER TUDO DAQUI PARA BAIXO | CRIAR FUNÇÃO PARA ATUALIZAR DADOS NA TABELA
    async updateNote(id, media){
        //console.log(id + " " + media)
        const sql = "UPDATE TB_texts SET num_media = ? WHERE id = ?";
        let values = [media, id]
        return new Promise((resolve, reject) => {
            con.query(sql, values, (err, row) => {
                if (err) reject(err)    
                resolve(row)
            })
        })
    },

    takeNotes: function(id){
        const sql = "SELECT * FROM TB_comments WHERE fk_text = ?";
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

    async searchAllComment(id) {
        const sql = "SELECT * FROM TB_comments WHERE fk_user = ?";
        return new Promise((resolve, reject) => {
            con.query(sql, id, (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    },

    create: function (title, test, assunt, redation, visible, valuetion_zero, user_id) {
        let sql = "INSERT INTO TB_texts(title, institute, topic, redation, visible, num_media, fk_user) VALUES ?"
        let values = [
            [title, test, assunt, redation, visible, valuetion_zero, user_id]
        ]
        con.query(sql, [values], function (err, result) {
            if (err) throw err
            console.log("Número de registros inseridos: ", result.affectedRows)
        })
    },

    delete: function (id) {
        let sql2 = "DELETE FROM TB_comments WHERE fk_text = ?"
        con.query(sql2, id, function (err2, result2) {
            if (err2) throw err2
            console.log("Numero de comentarios Apagados: ", result2.affectedRows);
            let sql = "DELETE FROM TB_texts WHERE id = ?"
            con.query(sql, id, function (err, result) {
                if (err) throw err
                console.log("Numero de textos Apagados: ", result.affectedRows);
            })
        })
    },

    createComment: function (comment, score, fk_user, fk_text) {
        let sql = "INSERT INTO TB_comments(comment, score, fk_user, fk_text) VALUES ?"
        let values = [
            [comment, score, fk_user, fk_text]
        ]
        con.query(sql, [values], function (err, result) {
            if (err) throw err
            console.log("Numero de linhas Comentadas: ", result.affectedRows);
        })
    },

    deleteComment: function (id) {
        let sql = "DELETE FROM TB_comments WHERE id = ?"
        con.query(sql, id, function (err, result) {
            if (err) throw err
            console.log("Numero de comentarios Apagados: ", result.affectedRows);
        })
    },

}