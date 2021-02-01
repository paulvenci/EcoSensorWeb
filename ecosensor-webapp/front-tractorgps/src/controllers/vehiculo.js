const Vehiculo = require("../models/vehiculo.js");

exports.findAll = (req, res) => {
    Vehiculo.getAll((err, data) => {
        if (err)
            res.status(500).send({ message: err.message || "Ocurrió un error al listar los vehiculos" });
        else
            res.status(200).send(data);
    });
};

exports.findOne = (req, res) => {
    Vehiculo.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Vehiculo id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Vehiculo id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.findPatente = (req, res) => {
    Vehiculo.findByPatente(req.params.patente, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Vehiculo id ${req.params.patente} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Vehiculo id ${req.params.patente}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.findImei = (req, res) => {
    Vehiculo.findByImei(req.params.imei, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `No se encontraron Vehiculos relacionados al imei ${req.params.imei}` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder a los vehiculos relacionados al imei ${req.params.imei}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "El contenido no puede venir vacío" });
    }
    Vehiculo.create(new Vehiculo(req.body), (err, data) => {
        if (err)
            res.status(500).send({ message: err.message || "Ocurrió un error al crear el vehiculo" });
        else
            res.status(200).send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "El contenido no puede venir vacío" });
    }
    Vehiculo.updateById(req.params.id, new Vehiculo(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Vehiculo id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar modificar el Vehiculo id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.delete = (req, res) => {
    Vehiculo.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Vehiculo id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar eliminar el Vehiculo id ${req.params.id}` });
            }
        } else {
            res.status(200).send({ message: `El Vehiculo fue eliminado exitosamente` });
        }
    });
};
