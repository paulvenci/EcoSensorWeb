const { createLogger, format, transports } = require('winston');
const moment = require('moment');
module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.printf(info => `[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${info.level} ${info.message}`)
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/error-log-api.log`,
            level: 'error'
        }),
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/warn-log-api.log`,
            level: 'warn'
        }),
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/info-log-api.log`,
            level: 'info'
        }),
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/debug-api.log`,
            level: 'debug'
        }),
        new transports.Console({
            level: 'error'
        }),
        new transports.Console({
            level: 'warn'
        }),
        new transports.Console({
            level: 'info'
        }),
        new transports.Console({
            level: 'debug'
        })
    ]
});