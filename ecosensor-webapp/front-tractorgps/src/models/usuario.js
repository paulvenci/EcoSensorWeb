const sql = require("../config/database.js");

let resultado = new Object;
resultado.errorEstado = false;
resultado.mensajeError = "";
resultado.objeto = null;

let usr = new Object;
usr.rut = "";
usr.nombreUsuario = "";
usr.password = "";
usr.perfil_id = "";
usr.nombres = "";
usr.cargo = "";
usr.paterno = "";
usr.materno = "";
usr.email = "";
usr.empresa_rut = "";
usr.reset = "";
usr.estado = "";
usr.nombreCompleto = "";


function findByUsername(username, pass) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT USR.id AS usuario_id, USR.rut AS usuario_rut, USR.nombre_usuario AS usuario_nombre_usuario, USR.perfil_id AS usuario_perfil_id, PER.perfil AS perfil_nombre, USR.nombres AS usuario_nombres, USR.paterno AS usuario_paterno, USR.materno AS usuario_materno, USR.password AS usuario_password, USR.cargo AS usuario_cargo, USR.email AS usuario_email, USR.empresa_rut AS usuario_empresa_rut, USR.reset AS usuario_reset, USR.estado AS usuario_estado FROM usuario USR INNER JOIN perfil PER ON USR.perfil_id = PER.id WHERE USR.estado = 1 AND USR.nombre_usuario = ? `, [username], (err, rows) => {
            if (!err) {
                if ((rows.length > 0) && (pass == rows[0].usuario_password)) {
                    usr.nombreCompleto = rows[0].usuario_nombres + " " + rows[0].usuario_paterno + " " + rows[0].usuario_materno;
                    usr.rut = rows[0].usuario_rut;
                    usr.nombreUsuario = rows[0].usuario_nombre_usuario;
                    usr.password = '';
                    usr.perfil_id = rows[0].usuario_perfil_id;
                    usr.nombres = rows[0].usuario_nombres;
                    usr.paterno = rows[0].usuario_paterno;
                    usr.materno = rows[0].usuario_materno;
                    usr.cargo = rows[0].usuario_cargo;
                    usr.email = rows[0].usuario_email;
                    usr.empresa_rut = rows[0].usuario_empresa_rut;
                    usr.reset = rows[0].usuario_reset;
                    usr.estado = rows[0].usuario_estado;
                    resultado.errorEstado = false;
                    resultado.mensajeError = "";
                    resultado.objeto = usr;
                } else {
                    resultado.errorEstado = true;
                    resultado.mensajeError = "Usuario no encontrado"
                    resultado.objeto = null;
                }
            } else {
                resultado.errorEstado = true;
                resultado.mensajeError = err;
                resultado.objeto = null;
            }
            //console.log(resultado);

            resolve(resultado);
        })
    })
}

function getAll(result) {
    sql.query(`SELECT USR.id, USR.rut, USR.nombre_usuario, USR.perfil_id, PER.nombre AS perfil_nombre, USR.nombres, USR.cargo, USR.paterno, USR.materno, USR.email, USR.empresa_rut, USR.reset, USR.estado FROM usuario USR INNER JOIN perfil PER ON USR.perfil_id = PER.id WHERE USR.estado = 1 ORDER BY USR.nombres, USR.paterno, USR.materno`, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
}
function findById(id, result) {
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
}
function findByRut(rut, result) {
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
}
function findByStore(empresa_rut, result) {
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
}
async function create(usuario, result) {
    var pass = password.genera();
    usuario.password = await password.encripta(pass);
    usuario.reset = 1;
    usuario.estado = 1;
    sql.query(`INSERT INTO usuario(rut, nombre_usuario, perfil_id, nombres, cargo, paterno, materno, email, empresa_rut, password, reset, estado) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [usuario.rut, usuario.usuario, usuario.perfil_id, usuario.nombres, usuario.cargo, usuario.paterno, usuario.materno, usuario.email, usuario.empresa_rut, usuario.password, usuario.reset, usuario.estado], (err, res) => {
        if (err) {
            result(err, null)
            return;
        }
        usuario.id = res.insertId;
        result({ ...usuario });
    });
}
function updateById(id, usuario, result) {
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
}
function remove(id, result) {
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
}


module.exports.findByUsername = findByUsername;