const mysqlConnection = require('../config/datasource');
const { resume } = require('../libs/logger');

class Control {
    constructor(control) {
        this.id = control.id;
        this.nombre = control.nombre;
        this.descripcion = control.descripcion;
        this.marca = control.marca;
        this.modelo = control.modelo;
        this.dispositivo_imei = control.dispositivo_imei;
        this.estado = control.estado;
        this.operario_id = control.operario_id;
        this.codigo = control.codigo;
        this.tipo = control.tipo;
    }
    static getAllbyImei(imei, result) {
        const query = `SELECT  nombre, descripcion, marca, modelo, dispositivo_imei, estado
    FROM    control
    WHERE   dispositivo_imei =?`;
        mysqlConnection.query(query, [imei], (err, rows) => {
            if (err) {
                result(err, null);
                return;
            }
            if (rows.length) {

                var valor = [];
                var resultado = '';
                rows.forEach(element => {
                    var nombreSensor = element.nombre;
                    var datoSensor = element.estado;
                    resultado += '"' + String(nombreSensor) + '":' + String(datoSensor) + ',';
                });
                resultado = '{' + resultado.substring(0, resultado.length - 1) + '}';
                // resultado = JSON.stringify(resultado);
                console.log(resultado);

                result(null, resultado);
                return;
            }
            result({ kind: "not_found" }, null);
            console.log('Error: ' + err);
            return;
        });
    }

    // static findById(id, result) {
    //     const query = `SELECT  id, nombre, descripcion, marca, modelo, dispositivo_imei, estado, operario_id, codigo, tipo
    //     FROM    sensor
    //     WHERE   id =?`;
    //     mysqlConnection.query(query, [id], (err, rows) => {
    //         if (err) {
    //             result(err, null);
    //             return;
    //         }
    //         if (rows.length) {
    //             result(null, rows[0]);
    //             return;
    //         }
    //         result({ kind: "not_found" }, null);
    //         return;
    //     });
    // }
    // static async create(sensor, result) {
    //     sensor.estado = 1;
    //     mysqlConnection.query(`INSERT INTO sensor(nombre, descripcion, marca, modelo, dispositivo_imei, estado, operario_id, codigo, tipo)
    //  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //         [sensor.nombre, sensor.descripcion, sensor.marca, sensor.modelo, sensor.dispositivo_imei, sensor.estado, sensor.operario_id, sensor.codigo, sensor.tipo], (err, res) => {
    //             if (err) {
    //                 result(err, null);
    //                 return;
    //             }
    //             sensor.id = res.insertId;
    //             console.log({ ...control });

    //             result(null, { ...control });
    //         });
    // }
    // static updateById(id, control, result) {
    //     sql.query(`UPDATE sensor SET nombre = ?, descripcion = ?, marca = ?, modelo = ?, dispositivo_imei = ?, estado = ?, operario_id = ?, codigo = ?, tipo = ? WHERE id = ?`, [sensor.nombre, sensor.descripcion, sensor.marca, sensor.modelo, sensor.dispositivo_imei, sensor.estado, sensor.operario_id, sensor.codigo, sensor.tipo, id], (err, res) => {
    //         if (err) {
    //             result(null, err);
    //             return;
    //         }
    //         if (res.affectedRows == 0) {
    //             result({ kind: "not_found" }, null);
    //             return;
    //         }

    //         result(null, { ...sensor });
    //     });
    // }
    // static remove(id, result) {
    //     sql.query(`UPDATE sensor SET estado = 0 WHERE id = ?`, [id], (err, res) => {
    //         if (err) {
    //             result(null, err);
    //             return;
    //         }
    //         if (res.affectedRows == 0) {
    //             result({ kind: "not_found" }, null);
    //             return;
    //         }
    //         result(null, { ...sensor });
    //     });
    // }
}

module.exports = Control;
