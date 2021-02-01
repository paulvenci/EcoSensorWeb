const jwt = require('jsonwebtoken');

const sql = require("../config/database.js");
const { config } = require("../config/config.js");
const Password = require("../libs/password.js");

const password = new Password();

const Vehiculo = function (vehiculo) {
    this.nombre = vehiculo.nombre;
    this.patente = vehiculo.patente;
    this.tipo = vehiculo.tipo;
    this.color = vehiculo.color;
    this.modelo = vehiculo.modelo;
    this.marca = vehiculo.marca;
    this.ano = vehiculo.ano;
    this.km_inicial = vehiculo.km_inicial;
    this.horometro_inicial = vehiculo.horometro_inicial;
    this.dispositivo_imei = vehiculo.dispositivo_imei;
    this.estado = vehiculo.estado;
};

Vehiculo.getAll = result => {
    sql.query(`SELECT nombre, patente, tipo, color, modelo, marca, ano, km_inicial,horometro_inicial, dispositivo_imei, estado
    FROM vehiculo WHERE estado = true`, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Vehiculo.findById = (id, result) => {
    sql.query(`SELECT nombre, patente, tipo, color, modelo, marca, ano, km_inicial,horometro_inicial, dispositivo_imei, estado
    FROM vehiculo WHERE id = ${id}`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Vehiculo.findByPatente = (patente, result) => {
    sql.query(`SELECT nombre, patente, tipo, color, modelo, marca, ano, km_inicial,horometro_inicial, dispositivo_imei, estado
    FROM vehiculo WHERE patente = ${patente}`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Vehiculo.findByImei = (imei, result) => {
    sql.query(`SELECT nombre, patente, tipo, color, modelo, marca, ano, km_inicial,horometro_inicial, dispositivo_imei, estado 
    FROM vehiculo WHERE dispositivo_imei = ${imei}`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};


Vehiculo.create = async (vehiculo, result) => {
    vehiculo.estado = 1;
    sql.query(`INSERT INTO vehiculo(nombre, patente, tipo, color, modelo, marca, ano, km_inicial,horometro_inicial, dispositivo_imei, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [vehiculo.nombre, vehiculo.patente, vehiculo.tipo, vehiculo.color, vehiculo.modelo, vehiculo.marca, vehiculo.ano, vehiculo.km_inicial, vehiculo.horometro_inicial, vehiculo.dispositivo_imei, vehiculo.estado], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        vehiculo.id = res.insertId;
        result(null, { ...vehiculo });
    });
};

Vehiculo.updateById = (id, vehiculo, result) => {
    sql.query(`UPDATE vehiculo SET nombre = ?, patente = ?, tipo = ?, tipo = ?, color = ?, modelo = ?, marca = ?, ano = ?, km_inicial = ?, horometro_inicial = ?, dispositivo_imei = ?, estado = ? WHERE id = ?`, [vehiculo.nombre, vehiculo.patente, vehiculo.tipo, vehiculo.color, vehiculo.modelo, vehiculo.marca, vehiculo.ano, vehiculo.km_inicial, vehiculo.horometro_inicial, vehiculo.dispositivo_imei, vehiculo.estado, id], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        vehiculo.id = res.insertId;
        result(null, { ...vehiculo });
    });
};

Vehiculo.remove = (id, result) => {
    sql.query(`UPDATE vehiculo SET estado = 0 WHERE id = ?`, [id], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        vehiculo.id = res.insertId;
        result(null, { ...vehiculo });
    });
};

module.exports = Vehiculo;