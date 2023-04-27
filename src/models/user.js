const textController = require('../controllers/userController')
const con = require('../BD/db').pool

//Na model são criadas as operações que são realizadas no banco | CRUD
module.exports = {
        async searchAll(){
            const sql = "SELECT * FROM tb_users"
            return Promise((resolve,reject)=>{
                con.query(sql,(err,row)=>{
                    if(err) reject(err)
                    resolve(row)
                })
            })
        }


}