const express = require('express');
//const Token = require('../libs/token');

//const token = new Token();

const app = express();
//app.use('/api/gps', token.verifica, require('../routes/gps'));
app.use('/api/sensor', require('../routes/sensor'));
app.use('/api/registro_sensor', require('../routes/registro_sensor'));
app.use('/api/control', require('../routes/control'));
app.use('/api/vehiculo', require('../routes/vehiculo'));
app.use('/', require('../routes/root'));


module.exports = app;