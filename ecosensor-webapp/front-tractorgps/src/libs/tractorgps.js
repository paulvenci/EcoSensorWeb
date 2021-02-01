const mysqlConnection = require('../config/database');
function autenticar(_nombreUsuario, _password) {
    return new Promise((resolve, reject) => {
        console.log('Autenticando, nombre usuario: ' + _nombreUsuario);

        const query = `
        SELECT nombreUsuario, contraseña FROM usuario WHERE nombreUsuario = ?`;
        mysqlConnection.query(query, [_nombreUsuario], (err, rows) => {
            if (!err) {
                console.log('contraseña: ' + rows[0].contraseña);

                if (_password == rows[0].contraseña) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject(err);
            }
        })
    })
}

function actualizaControl(_imei, _estado) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE alertas SET estado = ? WHERE dispositivo_imei = ?`;
        mysqlConnection.query(query, [_estado, _imei], (err) => {
            if (!err) {
                resolve(true);
            } else {
                console.log('Error: ' + err);
                reject(err);
            }
        })
    })
}

function ubicacion(_userName) {
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

function reporteOperario(_fechaInicio, _fechaFin, _rut) {

    return new Promise((resolve, reject) => {
        const query = "CALL spReporteOperarioFecha(?,?,?)";
        try {
            mysqlConnection.query(query, [_fechaInicio, _fechaFin, _rut], (err, rows) => {
                //console.log(rows);
                if (!err) {
                    //console.log(rows);
                    resolve(rows[0]);
                } else {
                    console.log('Error: ' + err);
                    reject(err);
                }
            })
        } catch (error) {
            console.log('Error: ' + error);

            reject(error)
        }

    })
}

module.exports.ubicacion = ubicacion;
module.exports.autenticar = autenticar;
module.exports.reporteOperario = reporteOperario;
module.exports.actualizaControl = actualizaControl;

