const errors = require('restify-errors')
const Customer = require('../models/Customer')
module.exports = (server) => {

    server.get('/customers', async (req, res, next) => {
        try {
            const customers = await Customer.find({})
            res.send(customers)
            next()
        } catch (err) {
            return next(new errors.InvalidContentError(err))
        }
    })

    server.get('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findById(req.params.id)
            res.send(customer)
            next()
        } catch (err) {
            return next(new errors.NotFoundError(`There's no customer by this id ${req.params.id}`))
        }
    })

    server.post('/customers', async (req, res, next) => {

        if (!req.is('application/json'))
            return next(new errors.InvalidContentError("Expects 'applicatoin/json'"))

        const { name, email, balance } = req.body
        const customer = new Customer({ name, email, balance })

        try {
            const newCustomer = await customer.save()
            res.send(201)
            next()
        } catch (err) {
            return next(new errors.InternalError(err.message))
        }
    })

    server.put('/customers/:id', async (req, res, next) => {

        if (!req.is('application/json'))
            return next(new errors.InvalidContentError("Expects 'applicatoin/json'"))

        try {
            const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body)
            res.send(200)
            next()
        } catch (err) {
            return next(new errors.NotFoundError(`There's no customer by this id ${req.params.id}`))
        }
    })

    server.del('/customers/:id', async (req, res, next) => {

        try {
            const customer = await Customer.findOneAndRemove({ _id: req.params.id })
            res.send(204)
            next()
        } catch (err) {
            return next(new errors.NotFoundError(`There's no customer by this id ${req.params.id}`))
        }
    })
}