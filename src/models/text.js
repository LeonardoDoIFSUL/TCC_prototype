const textController = require('../controllers/textController')
const con = require('../BD/db').pool

//Na model são criadas as operações que são realizadas no banco | CRUD
module.exports = {

    //Seleciona tudo de todos os textos | LISTA
        async searchAll(){
            const sql = "SELECT * FROM tb_texts"
            return Promise((resolve,reject)=>{
                con.query(sql,(err,row)=>{
                    if(err) reject(err)
                    resolve(row)
                })
            })
        }

}