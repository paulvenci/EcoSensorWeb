const router = require('express').Router();
const path = require('path');


//rutas
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

router.get('/estadistica', (req, res) => {
    res.render('estadistica')
})

router.get('/dispositivo', (req, res) => {
    // res.render('estadistica')

})
module.exports = router