const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.authenticate = (email, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email })
            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (err) throw err
                if (isMatch){
                    resolve(user)
                }else{
                    reject('Password wrong')
                }
            })
        } catch (error) {
            reject('Auth rejected')
        }
    })
}