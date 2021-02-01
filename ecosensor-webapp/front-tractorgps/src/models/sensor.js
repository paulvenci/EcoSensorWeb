

//const sql = require("../config/datasource.js");
const mysqlConnection = require('../config/datasource');

class Sensor {
    constructor(sensor) {
        this.id = sensor.id;
        this.nombre = sensor.nombre;
        this.descripcion = sensor.descripcion;
        this.marca = sensor.marca;
        this.modelo = sensor.modelo;
        this.dispositivo_imei = sensor.dispositivo_imei;
        this.estado = sensor.estado;
        this.operario_id = sensor.operario_id;
        this.codigo = sensor.codigo;
        this.tipo = sensor.tipo;
    }
    static getAllbyImei(imei, result) {
        const query = `SELECT  id, nombre, descripcion, marca, modelo, dispositivo_imei, estado, operario_id, codigo, tipo
    FROM    sensor
    WHERE   dispositivo_imei =?`;
        mysqlConnection.query(query, [imei], (err, rows) => {
            if (err) {
                result(err, null);
                return;
            }
            if (rows.length) {
                result(null, rows);
                return;
            }
            result({ kind: "not_found" }, null);
            console.log('Error: ' + err);
            return;
        });
    }
    static findById(id, result) {
        const query = `SELECT  id, nombre, descripcion, marca, modelo, dispositivo_imei, estado, operario_id, codigo, tipo
        FROM    sensor
        WHERE   id =?`;
        mysqlConnection.query(query, [id], (err, rows) => {
            if (err) {
                result(err, null);
                return;
            }
            if (rows.length) {
                result(null, rows[0]);
                return;
            }
            result({ kind: "not_found" }, null);
            return;
        });
    }
    static async create(sensor, result) {
        sensor.estado = 1;
        mysqlConnection.query(`INSERT INTO sensor(nombre, descripcion, marca, modelo, dispositivo_imei, estado, operario_id, codigo, tipo)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sensor.nombre, sensor.descripcion, sensor.marca, sensor.modelo, sensor.dispositivo_imei, sensor.estado, sensor.operario_id, sensor.codigo, sensor.tipo], (err, res) => {
                if (err) {
                    result(err, null);
                    return;
                }
                sensor.id = res.insertId;
                console.log({ ...sensor });

                result(null, { ...sensor });
            });
    }
    static updateById(id, sensor, result) {
        sql.query(`UPDATE sensor SET nombre = ?, descripcion = ?, marca = ?, modelo = ?, dispositivo_imei = ?, estado = ?, operario_id = ?, codigo = ?, tipo = ? WHERE id = ?`, [sensor.nombre, sensor.descripcion, sensor.marca, sensor.modelo, sensor.dispositivo_imei, sensor.estado, sensor.operario_id, sensor.codigo, sensor.tipo, id], (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }

            result(null, { ...sensor });
        });
    }
    static remove(id, result) {
        sql.query(`UPDATE sensor SET estado = 0 WHERE id = ?`, [id], (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { ...sensor });
        });
    }
}

module.exports.findByUsername = findByUsername;
