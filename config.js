require('dotenv').config();


module.exports = {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 4200,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
}