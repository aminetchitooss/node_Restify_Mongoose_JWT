const errors = require('restify-errors')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Auth = require('./auth')
const config = require('../config')
const rjwt = require('restify-jwt-community')

module.exports = (server) => {

    //protecting a specific route
    server.post('/register', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {

        if (!req.is('application/json'))
            return next(new errors.InvalidContentError("Expects 'application/json'"))

        const { email, password } = req.body
        const user = new User({ email, password })

        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, async (error, hash) => {
                user.password = hash
                try {
                    const newUser = await user.save()
                    res.send(201)
                    next()
                } catch (err) {
                    return next(new errors.InternalError(err.message))
                }
            })
        })


    })

    server.post('/auth', async (req, res, next) => {
        const { email, password } = req.body
        try {
            const user = await Auth.authenticate(email, password)
            const userObject = user.toJSON()
            delete userObject.password
            const token = jwt.sign(userObject, config.JWT_SECRET)
            const { iat, exp } = jwt.decode(token)
            res.send({ iat, token })
            next()
        } catch (err) {
            return next(new errors.UnauthorizedError(err))
        }
    })

    server.get('/users', async (req, res, next) => {
        try {
            const users = await User.find({})
            res.send(users)
            next()
        } catch (err) {
            return next(new errors.InvalidContentError(err))
        }
    })

    server.get('/users/:id', async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
            res.send(user)
            next()
        } catch (err) {
            return next(new errors.NotFoundError(`There's no customer by this id ${req.params.id}`))
        }
    })

    server.put('/users/:id', async (req, res, next) => {

        if (!req.is('application/json'))
            return next(new errors.InvalidContentError("Expects 'applicatoin/json'"))

        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body)
            res.send(200)
            next()
        } catch (err) {
            return next(new errors.NotFoundError(`There's no customer by this id ${req.params.id}`))
        }
    })

    server.del('/users/:id', async (req, res, next) => {

        try {
            const user = await User.findOneAndRemove({ _id: req.params.id })
            res.send(204)
            next()
        } catch (err) {
            return next(new errors.NotFoundError(`There's no customer by this id ${req.params.id}`))
        }
    })
}