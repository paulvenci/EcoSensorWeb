const mysqlConnection = require('../config/database');

function datos() {
    return new Promise((resolve, reject) => {
        console.log('Entrando..');

        const query = 'select * from data_device where dispositivo_id = 1 ORDER BY id DESC LIMIT 50';
        mysqlConnection.query(query, (err, rows) => {
            if (!err) {
                resolve(rows[0]);
                console.log(rows[0].temperatura);
            } else {
                console.log('Error: ' + err);
                reject = false;
            }
        })
    })
}

function estadoDispositivo(_userName) {
    return new Promise((resolve, reject) => {
        console.log('Entregando ubicación...' + _userName);
        const query = `call spUbicacionDispositivo(?)`;
        mysqlConnection.query(query, [_userName], (err, rows) => {
            if (!err) {
                resolve(rows[0]);
                //console.log(rows[0]);
            } else {
                console.log('Error: ' + err);
                reject = false;
            }
        })
    })
}


module.exports.datos = datos;
module.exports.estadoDispositivo = estadoDispositivo;
