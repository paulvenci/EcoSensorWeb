const jwt = require('jsonwebtoken');

const sql = require("../../config/database.js");
const { config } = require("../../config/config.js");
const Password = require("../../libs/password.js");

const password = new Password();

const Usuario = function (usuario) {
    this.rut = usuario.rut;
    this.nombreUsuario = usuario.nombreUsuario;
    this.password = usuario.password;
    this.perfil_id = usuario.perfil_id;
    this.nombres = usuario.nombres;
    this.cargo = usuario.cargo;
    this.paterno = usuario.paterno;
    this.materno = usuario.materno;
    this.email = usuario.email;
    this.empresa_rut = usuario.empresa_rut;
    this.reset = usuario.reset;
    this.estado = usuario.estado;
};

Usuario.getAll = result => {
    sql.query(`SELECT USR.id, USR.rut, USR.nombre_usuario, USR.perfil_id, PER.nombre AS perfil_nombre, USR.nombres, USR.cargo, USR.paterno, USR.materno, USR.email, USR.empresa_rut, USR.reset, USR.estado FROM usuario USR INNER JOIN perfil PER ON USR.perfil_id = PER.id WHERE USR.estado = 1 ORDER BY USR.nombres, USR.paterno, USR.materno`, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Usuario.findById = (id, result) => {
    sql.query(`SELECT USR.id, USR.rut, USR.nombre_usuario, USR.perfil_id, PER.nombre AS perfil_nombre, USR.nombres, USR.cargo, USR.paterno, USR.materno, USR.email, USR.empresa_rut, USR.reset, USR.estado FROM usuario USR INNER JOIN perfil PER ON USR.perfil_id = PER.id WHERE USR.id = ${id}`, (err, res) => {
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

Usuario.findByRut = (rut, result) => {
    sql.query(`SELECT USR.id, USR.rut, USR.nombre_usuario, USR.perfil_id, PER.nombre AS perfil_nombre, USR.nombres, USR.cargo, USR.paterno, USR.materno, USR.email, USR.empresa_rut, USR.reset, USR.estado FROM usuario USR INNER JOIN perfil PER ON USR.perfil_id = PER.id WHERE USR.rut = ${rut}`, (err, res) => {
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

Usuario.findByStore = (empresa_rut, result) => {
    sql.query(`SELECT USR.id, USR.rut, USR.nombre_usuario, USR.perfil_id, PER.nombre AS perfil_nombre, USR.nombres, USR.cargo, USR.paterno, USR.materno, USR.email, USR.empresa_rut, USR.reset, USR.estado FROM usuario USR INNER JOIN perfil PER ON USR.perfil_id = PER.id WHERE USR.empresa_rut = '${empresa_rut}' AND USR.perfil_id = 1`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Usuario.create = async (usuario, result) => {
    var pass = password.genera();
    usuario.password = await password.encripta(pass);
    usuario.reset = 1;
    usuario.estado = 1;
    sql.query(`INSERT INTO usuario(rut, nombre_usuario, perfil_id, nombres, cargo, paterno, materno, email, empresa_rut, password, reset, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [usuario.rut, usuario.usuario, usuario.perfil_id, usuario.nombres, usuario.cargo, usuario.paterno, usuario.materno, usuario.email, usuario.empresa_rut, usuario.password, usuario.reset, usuario.estado], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...usuario, password: pass });
    });
};

Usuario.updateById = (id, usuario, result) => {
    sql.query(`UPDATE usuario SET rut = ?, usuario = ?, perfil_id = ?, nombres = ?, cargo = ?, paterno = ?, materno = ?, email = ?, empresa_rut = ? WHERE id = ?`, [usuario.rut, usuario.usuario, usuario.perfil_id, usuario.nombres, usuario.cargo, usuario.paterno, usuario.materno, usuario.email, usuario.empresa_rut, id], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, { id: id, ...usuario });
    });
};

Usuario.remove = (id, result) => {
    sql.query(`UPDATE usuario SET estado = 0 WHERE id = ?`, [id], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, { id: id, ...usuario });
    });
};

module.exports = Usuario;