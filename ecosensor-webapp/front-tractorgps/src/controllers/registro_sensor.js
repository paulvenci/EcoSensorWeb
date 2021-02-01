const Registro_sensor = require("../models/registro_sensor.js");

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
    if (!req.body) {
        res.status(400).send({ message: "El contenido no puede venir vacío" });
    }
    Registro_sensor.create(new Registro_sensor(req.body), (err, data) => {
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
