const Control = require("../models/control.js");

// Lista por IMEI
exports.findxImei = (req, res) => {
    Control.getAllbyImei(req.params.imei, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: err.message || "Ocurrió un error al listar los sensores" })
            } else {
                res.status(500).send({ message: `Hubo un error al intentar acceder al Usuario id ${req.params.imei}` });
            }
        } else {
            res.status(200).send(data);
        }
    })
};