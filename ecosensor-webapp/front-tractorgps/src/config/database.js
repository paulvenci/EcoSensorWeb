const mysql = require("mysql");
const logger = require('../libs/logger');

var mysqlConnection = mysql.createPool({
    connectionLimit: 100,
    waitForConnections: true,
    queueLimit: 0,
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.DATABASE_NAME,
    port: process.env.PORT_DB,
    debug: false,
    wait_timeout: 28800,
    connect_timeout: 10,
    multipleStatements: 'true'
});

mysqlConnection.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            logger.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            logger.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            logger.error('Database connection was refused.')
        }
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            logger.error('Acceso denegado')
        }
        if (err.code === 'ER_BAD_DB_ERROR') {
            logger.error('Base de datos no existe')
        }
        if (err.code === 'ENOTFOUND') {
            logger.error('Servidor no se encuentra')
        }
        if (err.code === 'ETIMEDOUT') {
            logger.error('Error al conectar a base de datos: Respuesta del servidor no recivida a tiempo')
        }
        else {
            logger.error("Error en conexión de base de datos: " + err);
        }
    }
    if (connection) {
        logger.info("Base de datos conectada");
        connection.release()
    }
    return
});

module.exports = mysqlConnection;