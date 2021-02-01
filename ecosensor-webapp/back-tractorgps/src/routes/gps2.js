const express = require('express');
const router = express.Router();
const mysqlConnection = require('../config/database');
const moment = require('moment');
const respuesta = require('../libs/respuesta');

// DATA desde gsm
router.post('/prueba', (req, res) => {
    var data = req.params.field1;
    console.log(data);

    console.log(req.body);
    //res.status(204);
    respuesta.resultHttp(204, res, null, "OK", req);
});

// DATA desde gsm
router.post('/', (req, res) => {

    console.log(req.body);
    let imei = req.body.imei;
    let lat = req.body.lat;
    let lon = req.body.lon;
    let vel = req.body.vel;
    let rfid = req.body.user;
    let acc = req.body.acc;
    let bat = req.body.bat;
    let evento = req.body.e;
    let fechaHoraHoy = new Date();
    const query = `INSERT INTO ubicacion (imei, latitud, longitud, rfid, velocidad, fecha, conAcc, conBat, eventoRfid) values (?,?,?,?,?,?,?,?,?)`;
    mysqlConnection.query(query, [imei, lat, lon, rfid, vel, fechaHoraHoy, acc, bat, evento], (err) => {
        if (!err) {
            respuesta.resultHttp(204, res, null, "Dato creado!", req);
        } else {
            respuesta.resultHttp(500, res, null, "Error en el servidor: " + err, req);
        }
    });
    // respuesta.resultHttp(204, res, null, "Dato recibido!", req);

});

router.get('/', (req, res) => {
    respuesta.resultHttp(200, res, "rojo", "Mensaje desde el Server", req)
})


module.exports = router;