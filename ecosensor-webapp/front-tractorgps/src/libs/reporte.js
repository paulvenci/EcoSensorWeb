const mysqlConnection = require('../config/database');

function reporteVehiculo(_imei, _fechaInicio, _fechaFin) {
    return new Promise((resolve, reject) => {
        console.log('Entregando reporte...' + _imei, _fechaInicio, _fechaFin);
        const query = `call sp_Reporte_Vehiculo(?,?,?)`;
        mysqlConnection.query(query, [_imei, _fechaInicio, _fechaFin], (err, rows) => {
            if (!err) {
                resolve(rows);
                //console.log(rows[0]);
            } else {
                console.log('Error: ' + err);
                reject = false;
            }
        })
    })
}
module.exports.reporteVehiculo = reporteVehiculo;
