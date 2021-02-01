const { resolveInclude } = require("ejs");
const Usuario = require("../models/usuario.js");

exports.findAll = (req, res) => {
    Usuario.getAll((err, data) => {
        if (err)
            res.status(500).send({ message: err.message || "Ocurrió un error al listar los usuarios" });
        else
            res.status(200).send(data);
    });
};

exports.findRut = (req, res) => {
    Usuario.findByRut(req.params.rut, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Usuario rut ${req.params.rut} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Usuario rut ${req.params.rut}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.findOne = (req, res) => {
    Usuario.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Usuario id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Usuario id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.findStore = (req, res) => {
    Usuario.findByStore(req.params.empresa_rut, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `No se encontraron usuarios relacionados a la empresa Rut ${req.params.empresa_rut}` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder a los usuarios relacionados a la empresa Rut ${req.params.empresa_rut}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.create = (data) => {
    return new Promise((resolve, reject) => {
        Usuario.create(new Usuario(data)).then((resultado) => {
            if (resultado) {
                resolve(resultado)
            } else {
                resolve(false)
            }
        }, (err) => {
            console.log('Error al crear usuario: ' + err);

        });

    })


};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "El contenido no puede venir vacío" });
    }
    Usuario.updateById(req.params.id, new Usuario(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Usuario id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar modificar el Usuario id ${req.params.id}` });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.delete = (req, res) => {
    Usuario.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `El Usuario id ${req.params.id} no fue encontrado` });
            } else {
                res.status(500).send({ message: `Hubo un error al intentar eliminar el Usuario id ${req.params.id}` });
            }
        } else {
            res.status(200).send({ message: `El Usuario fue eliminado exitosamente` });
        }
    });
};
