const restify = require('restify')
const mongoose = require('mongoose')
const rjwt = require('restify-jwt-community')
const config = require('./config')
const cors = require('cors')
const allowedOrigins = process.env.ALLOWED_URL.split(',');

const server = restify.createServer()

server.use(restify.plugins.bodyParser());

server.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

//protect routes
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/auth', '/'] }))

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
})

server.get('/', (req, res)=>{
    res.end('<h1>Using restify, mongoose and JWT</h1>')
})
const db = mongoose.connection

db.on('error', (err) => console.log('wroong DB', err))

db.once('open', () => {
    require('./routes/customers')(server);
    require('./routes/users')(server)
    console.log(`Server running on ... ${config.PORT}`)
})