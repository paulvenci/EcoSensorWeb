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


//rutas
app.use(require('../routes'));

//static files
app.use(express.static(path.join(__dirname, 'public')));


//WebSocket
const SocketIo = require('socket.io');
module.exports.io = SocketIo(server);
require('../sockets/socket');
