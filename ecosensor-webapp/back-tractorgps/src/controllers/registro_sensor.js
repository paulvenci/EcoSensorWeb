const Registro_sensor = require("../models/registro_sensor.js");
const moment = require("../../node_modules/moment")


// Lista por IMEI
exports.findxImei = (req, res) => {

    Registro_sensor.getAllbyImei(req.params.imei, (err, data) => {

        console.log('paso controler sensor' + req.params.imei);
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: err.message || "Ocurrió un error al listar los Registro_sensores" })
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Registro_sensor id ${req.params.imei}` });
            }
        } else {
            res.status(200).send(data);
        }
    })
};

exports.findOnexImei = (req, res) => {

    Registro_sensor.getOnebyImei(req.params.imei, (err, data) => {
        console.log('paso controler sensor' + req.params.imei);
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: err.message || "Ocurrió un error al listar los Registro_sensores" })
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Registro_sensor id ${req.params.imei}` });
            }
        } else {
            res.status(200).send(data);
        }
    })
};

// Busca por id
exports.findOne = (req, res) => {
    Registro_sensor.findById(req.params.id, (err, data) => {
        console.log('paso controler sensor' + req.params.imei);
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Sensor id ${req.params.id} no fue encontrado` })
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Sensor id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    })
};

exports.create = (req, res) => {
    console.log(req.body);

    if (!req.body) {
        res.status(400).send({ message: "El contenido no puede venir vacío" });
    }

    var testDateUtc = moment.utc();
    var localDate = moment(testDateUtc).utcOffset(-180); //set timezone offset in minutes
    console.log('Hora Local: ' + localDate.format());

    cuerpo = {
        dispositivo_imei: req.body.imei,
        fullData: 'fullData',
        fecha_hora: moment(localDate).format('YYYY-MM-DD HH:mm:ss'),
        latitud: req.body.lat,
        longitud: req.body.lon,
        velocidad: req.body.vel,
        altura: req.body.alt,
        dataS1: req.body.ds1,
        dataS2: req.body.ds2,
        dataS3: req.body.ds3,
        dataS4: req.body.ds4,
        dataS5: req.body.ds5,
        dataS6: null,
        dataS7: null,
        dataS8: null,
        dataS9: null,
        dataS10: null,
        eventoS1: req.body.es1,
        eventoS2: req.body.es2,
        eventoS3: req.body.es3,
        eventoS4: req.body.es4,
        eventoS5: req.body.es5,
        eventoS6: null,
        eventoS7: null,
        eventoS8: null,
        eventoS9: null,
        eventoS10: null
    }

    Registro_sensor.create(new Registro_sensor(cuerpo), (err, data) => {
        if (err)
            res.status(500).send({ message: err.message || "Ocurrió un error al crear el Sensor" });
        else
            res.status(200).send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "El contenido no puede venir vacío" });
    }
    Registro_sensor.updateById(req.params.id, new Sensor(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Sensor id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar modificar el Senspor id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.delete = (req, res) => {
    Registro_sensor.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Sensor id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar eliminar el Sensor id ${req.params.id}` });
            }
        } else {
            res.status(200).send({ message: `El Sensor fue eliminado exitosamente` });
        }
    });
};
