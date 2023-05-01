const textController = require('../controllers/userController')
const con = require('../BD/db').pool
const saltRounds = 10

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
        },

        async searchOne(id){
            //Falta fazer essa função
        },
        
        create: function(name,email,passwd,role,image){
            bcrypt.hash(senha,saltRounds, function(err,hash){
                if(err) throw err
                var sql = "INSERT INTO tb_users (name,email,passwd,role,) VALUES ?"
                var values = [[name,email,passwd,role,image]]

                con.query(sql, [values], function(err,result){
                    if(err) throw err
                    console.log("Usuario incluido com sucesso! ->", result.affectedRows)
                })
            })
        }
}