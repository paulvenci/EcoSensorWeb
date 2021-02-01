const router = require('express').Router();

//rutas
router.get('/', (req, res) => {
    res.render('index');
})

router.get('/estadistica', (req, res) => {
    res.render('estadistica')
})

router.get('/dispositivo', (req, res) => {
    // res.render('estadistica')

})
module.exports = router