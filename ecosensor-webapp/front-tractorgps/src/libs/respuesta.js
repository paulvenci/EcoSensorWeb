const logger = require('./logger');

function resultHttp(codigoRespuesta, res, rows, mensaje, req) {

    let _estado, _auth, _error, _token, _objeto;

    switch (codigoRespuesta) {
        case 200:  // OK
        case 201:  // Creado
        case 204:  // OK, sin contenido
            _estado = true;
            _auth = true;
            _error = null;
            _token = null;
            _objeto = rows;
            break;

        case 202: // Aceptado (Autorizado)
            _estado = true;
            _auth = true;
            _error = null;
            _token = rows.token;
            _objeto = rows;
            break;

        case 401: // No autorizado
        case 404: // No encontrado
            _estado = false;
            _auth = false;
            _error = true;
            _token = null;
            _objeto = null;
            break;

        case 409: // Conflicto
            _estado = true;
            _auth = true;
            _error = true;
            _token = null;
            _objeto = null;
            logger.warn(req.method + " " + req.originalUrl + " " + mensaje + " (res=" + res.statusCode + ")");
            break;

        case 500: // Error en servidor
            _estado = false;
            _auth = false;
            _error = true;
            _token = null;
            _objeto = null;
            break;
    }

    res.status(codigoRespuesta).json({
        estado: _estado,
        auth: _auth,
        error: _error,
        mensaje: mensaje,
        token: _token,
        objeto: _objeto
    });
    logger.debug(req.method + " " + req.originalUrl + " " + mensaje + " (res=" + res.statusCode + ")");
    switch (codigoRespuesta) {
        case 200:
        case 201:
        case 202:
        case 204:
            logger.info(req.method + " " + req.originalUrl + " " + mensaje + " (res=" + res.statusCode + ")");
            break;
        case 401:
        case 404:
        case 409:
            logger.warn(req.method + " " + req.originalUrl + " " + mensaje + " (res=" + res.statusCode + ")");
            break;
        case 500:
            logger.error(req.method + " " + req.originalUrl + " " + mensaje + " (res=" + res.statusCode + ")");
            break;
    }
};

module.exports.resultHttp = resultHttp;


