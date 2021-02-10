const logger = require('./libs/logger');
const morgan = require('morgan');
const express = require('express');
const NODE_ENV = '.env';
require('dotenv').config({ path: __dirname + '/.env' });
const app = express();

var bodyParser = require('body-parser');
const cors = require('cors');
app.set('port', process.env.PORT);

// Midd
app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./config/routes.js'));

app.listen(app.get('port'), () => {
    logger.debug('Servidor iniciado en el puerto ' + app.get('port'));
});

// app.get('/')
// app.post('/', (req, res) => {
//     console.log('post gps');

//     //res.status(204);
//     respuesta.resultHttp(204, res, null, "OK", req);
// });
// app.get('/', (req, res) => {
//     console.log('get gps');
//     console.log(req.body);

//     //res.status(204);
//     //respuesta.resultHttp(204, res, null, "OK", req);
// });