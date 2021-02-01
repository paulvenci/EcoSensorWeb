// const express = require('express');
const { Router } = require('express');
const router = Router();

const sensor = require("../controllers/sensor.js");

router.get('/dispositivo/:imei', sensor.findxImei);
router.get('/:id', sensor.findOne);
router.post("/", sensor.create);
router.put("/:id", sensor.update);
router.delete("/:id", sensor.delete);


module.exports = router;