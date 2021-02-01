// const express = require('express');
const { Router } = require('express');
const router = Router();

const registro_sensor = require("../controllers/registro_sensor.js");

router.get('/dispositivo/:imei', registro_sensor.findxImei);
router.get('/dispositivo/ultimo/:imei', registro_sensor.findOnexImei);
router.get('/:id', registro_sensor.findOne);
router.post("/", registro_sensor.create);
//router.put("/:id", registro_sensor.update);
//router.delete("/:id", registro_sensor.delete);


module.exports = router;