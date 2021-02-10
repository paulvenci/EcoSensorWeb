const router = require('express').Router();
const path = require('path');
const reporte = require('../libs/reporte')

//rutas
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

router.get('/estadistica', (req, res) => {
    res.render('estadistica')
})

router.post('/dispositivo', (req, res) => {

    // console.log(req.body);

    var _fechaFin = req.body.fechaFin;
    var _fechaInicio = req.body.fechaInicio;
    var _uid = req.body.uid;

    reporte.reporteOperario(_fechaInicio, _fechaFin, _uid).then((val) => {
        res.send(val);
    })
})


module.exports = router