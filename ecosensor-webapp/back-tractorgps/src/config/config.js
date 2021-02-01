require('dotenv').config({ path: __dirname + '/.env' });
console.log(__dirname);

const config = {
    db: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.PORT,
    dbPort: process.env.DB_PORT,
    authJwtSecret: process.env.SECRET_KEY_ENCR,
    cors: process.env.CORS,
    dev: process.env.NODE_ENV !== 'producción'
};

module.exports = { config };