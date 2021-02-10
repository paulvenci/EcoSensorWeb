const express = require('express');
//const engine = require('ejs-mate');
const path = require('path');



// const Usuario = require('../src/moddels/usuario');

const cron = require('cron').CronJob;
require('dotenv').config({ path: __dirname + '/.env' });

//inicializaciones
const app = express();

//Iniciando server
const server = app.listen(process.env.PORT, () => {
    console.log("Server on Port " + process.env.PORT);
})

//Configuraciones
// app.engine('ejs', engine);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));


//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//rutas
app.use(require('./routes'));


//WebSocket
const SocketIo = require('socket.io');
module.exports.io = SocketIo(server);
require('./sockets/socket');
require('./sockets/reporte');
require('./sockets/dispositivo');
require('./sockets/operario');
require('./sockets/usuario');



