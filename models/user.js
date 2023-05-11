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
    }
}