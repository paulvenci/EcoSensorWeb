const jwt = require('../../node_modules/jsonwebtoken');
const sql = require("../config/database.js");

let resultado = new Object;
resultado.errorEstado = false;
resultado.mensajeError = "";
resultado.objeto = null;

let dis = [];
let dispo = new Object;
dispo.id = '';
dispo.nombre = '';
dispo.descripcion = '';
dispo.marca = '';
dispo.modelo = '';
dispo.dispositivo_imei = '';
dispo.estado = '';
dispo.operario_id = '';
dispo.codigo = '';
dispo.tipo = '';

function dispositivoListar(data) {
    console.log(data.nombre_usuario);

    return new Promise((resolve, reject) => {
        sql.query(`
        SELECT 
        DIS.id AS dispositivo_id,
        DIS.nombre AS dispositivo_nombre, 
        DIS.descripcion AS dispositivo_descripcion,
        DIS.marca AS dispositivo_marca,
        DIS.modelo AS dispositivo_modelo,
        DIS.estado AS dispositivo_estado,
        DIS.imei AS dispositivo_imei,
        DIS.grupo_id AS dispositivo_grupo_id,
        DIS.chip_telefono AS dispositivo_chip_telefono,
        DIS.chip_compañia AS dispositivo_chip_compañia,
        DIS.valor_cargado AS dispositivo_valor_cargado,
        DIS.fecha_carga AS dispositivo_fecha_carga
        FROM dispositivo DIS 
        INNER JOIN dispositivo_usuario DIS_USU ON DIS_USU.dispositivo_id = DIS.id
        INNER JOIN usuario USU ON USU.id = DIS_USU.usuario_id
        WHERE USU.nombre_usuario =  '${data.nombre_usuario}'
        `, (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    dis.length = 0;
                    for (var i = 0; i < rows.length; i++) {
                        dispo = {
                            id: rows[i].dispositivo_id,
                            nombre: rows[i].dispositivo_nombre,
                            descripcion: rows[i].dispositivo_descripcion,
                            marca: rows[i].dispositivo_marca,
                            modelo: rows[i].dispositivo_modelo,
                            dispositivo_imei: rows[i].dispositivo_imei,
                            estado: rows[i].dispositivo_estado,
                            grupo_id: rows[i].dispositivo_grupo_id,
                            chip_telefono: rows[i].dispositivo_chip_telefono,
                            chip_compañia: rows[i].dispositivo_chip_compañia,
                            valor_cargado: rows[i].dispositivo_valor_cargado,
                            fecha_carga: rows[i].dispositivo_fecha_carga
                        }
                        dis.push(dispo);
                    }
                    resultado.errorEstado = false;
                    resultado.mensajeError = "";
                    resultado.objeto = dis;
                } else {
                    resultado.errorEstado = true;
                    resultado.mensajeError = "No se encontraron dispositivos";
                    resultado.objeto = null;
                }
            } else {
                resultado.errorEstado = true;
                resultado.mensajeError = err;
                resultado.objeto = null;
            }
            resolve(resultado);
        })
    })
}

module.exports.dispositivoListar = dispositivoListar; 