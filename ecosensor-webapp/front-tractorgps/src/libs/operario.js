const mysqlConnection = require('../config/database');
const moment = require('../../node_modules/moment');

function operarioLista(_userName) {
    console.log('operarioLista()=>' + _userName);

    return new Promise((resolve, reject) => {
        var query = `SELECT 
        concat (OPE.nombres, ' ', OPE.paterno, ' ', OPE.materno) AS operario_nombre,
        OPE.rut AS operario_rut,
        OPE.empresa_rut AS operario_empresa_rut,
        OPE.estado AS operario_estado,
        OPE.email AS operario_mail,
        OPE.uid AS operario_uid
        FROM operario OPE
        INNER JOIN usuario USU ON USU.id = OPE.usuario_id
        WHERE USU.nombre_usuario = ?`;

        mysqlConnection.query(query, [_userName], (err, rows) => {
            if (!err) {
                rows.forEach(element => {
                    console.log('usuarios: ' + element.operario_nombre);
                });
                resolve(rows)
            } else {
                reject(err)
            }
        })
    })
}

module.exports.operarioLista = operarioLista;