const { Router } = require('express');
const router = Router();

const control = require("../controllers/control.js");

router.get('/dispositivo/:imei', control.findxImei);
// router.get('/:id', sensor.findOne);
// router.post("/", sensor.create);
// router.put("/:id", sensor.update);
// router.delete("/:id", sensor.delete);


module.exports = router;