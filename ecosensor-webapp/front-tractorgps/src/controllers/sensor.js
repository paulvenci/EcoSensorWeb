const Sensor = require("../models/sensor.js");

// Lista por IMEI
exports.findxImei = (req, res) => {
    Sensor.getAllbyImei(req.params.imei, (err, data) => {
        console.log('paso controler sensor' + req.params.imei);
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: err.message || "Ocurrió un error al listar los sensores" })
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Usuario id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    })
};

// Busca por id
exports.findOne = (req, res) => {
    Sensor.findById(req.params.id, (err, data) => {
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
    Sensor.create(new Sensor(req.body), (err, data) => {
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
    Sensor.updateById(req.params.id, new Sensor(req.body), (err, data) => {
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
    Sensor.remove(req.params.id, (err, data) => {
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
