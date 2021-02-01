const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

class Token {

    verifica(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            res.status(401).send({ message: `No está autorizado` });
        } else {
            try {
                const decoded = jwt.verify(token, config.authJwtSecret);
                next();
            } catch (error) {
                res.status(401).send({ message: `No está autorizado` });
            };
        };
    }

}
module.exports = Token;