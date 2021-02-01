const { Router } = require('express');
const router = Router();

const vehiculo = require("../controllers/vehiculo.js");
router.get("/", vehiculo.findAll);
router.get("/:id", vehiculo.findOne);
router.get("/patente/:patente", vehiculo.findPatente);
router.get("/dispositivo/:imei", vehiculo.findImei);
router.post("/", vehiculo.create);
router.put("/:id", vehiculo.update);
router.delete("/:id", vehiculo.delete);

module.exports = router;