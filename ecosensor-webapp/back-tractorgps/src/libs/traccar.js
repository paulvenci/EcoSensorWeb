var request = require('../../node_modules/request');
//const mysqlConnection = require('../config/database');


/**
* Función para validar si un cliente de ElectroGPS está creado en Traccar
* @param {string} _usuario Parámetro a buscar en tabla 'users' de Traccar.
* @return {boolean} Retorna true si existe, false si no existe. Si hay error retorna el objeto Error.
* History 
* v1.0 - Creación de la función. (PMA)
* @author Paul Martínez (PMA)
*/

function validaExistenciaUsuarioTraccar(_usuario) {
    let jsonData;
    return new Promise((resolve, reject) => {

        const fullUrlTraccar = process.env.TRACCAR_PMA_URL + ":" + process.env.TRACCAR_PMA_PORT + "/api/users";
        const username = process.env.TRACCAR_PMA_USER;
        const passw = process.env.TRACCAR_PMA_PASS;
        var options = {
            method: 'GET',
            url: fullUrlTraccar,
            auth: { username: username, password: passw }
        };
        request(options, function (error, response, body) {
            if (!error) {
                jsonData = JSON.parse(body);
                let encontre = false;
                for (var i in jsonData) {
                    //console.log(jsonData[i].email);
                    if (jsonData[i].email == _usuario) {
                        console.log("usuario encontrado: " + jsonData[i].email);
                        encontre = true;
                        break;
                    };
                };
                resolve(encontre);
            } else {
                reject(error);
            };
        });
    });
};


/**
* Función para validar si un dispositivo de ElectroGPS está creado en Traccar
* @param {string} _uniqueId Parámetro a buscar en tabla 'devices' de Traccar.
* @return {boolean} Retorna true si existe, false si no existe. Si hay error retorna el objeto Error.
* History 
* v1.0 - Creación de la función. (PMA)
* @author Paul Martínez (PMA)
*/

function validaExistenciaDispositivoTraccar(_uniqueId) {
    return new Promise((resolve, reject) => {
        let jsonData;

        const fullUrlTraccar = process.env.TRACCAR_PMA_URL + ":" + process.env.TRACCAR_PMA_PORT + "/api/devices";
        const username = process.env.TRACCAR_PMA_USER;
        const passw = process.env.TRACCAR_PMA_PASS;
        var options = {
            method: 'GET',
            url: fullUrlTraccar,
            auth: { username: username, password: passw }
        };
        request(options, function (error, response, body) {
            if (!error) {
                jsonData = JSON.parse(body);
                let encontre = false;
                for (var i in jsonData) {
                    //console.log(jsonData[i].email);
                    if (jsonData[i].uniqueId == _uniqueId) {
                        console.log("usuario encontrado: " + jsonData[i].uniqueId);
                        encontre = true;
                        break;
                    };
                };
                resolve(encontre);
            } else {
                reject(error);
            };
        });
    });
};

function creaObjetoUsuarioTraccar(_name, _email, _password, _token, _phone, _attributes) {
    var usuario = {
        "name": _name,
        "id": 0,
        "email": _email,
        "readonly": 0,
        "administrator": 0,
        "map": "",
        "latitude": 0,
        "longitude": 0,
        "zoom": 0,
        "password": _password,
        "twelveHourFormat": 0,
        "coordinateFormat": "",
        "disabled": 0,
        "expirationTime": null,
        "deviceLimit": 1,
        "userLimit": 0,
        "deviceReadonly": 0,
        "limitCommands": 0,
        "poiLayer": "",
        "token": _token,
        "phone": _phone,
        "attributes": _attributes
        // Atributos, ejemplo
        // {"rut": rut, "nombres": nombres, "paterno": apellidoPaterno, "materno": apellidoMaterno, "tipo": tipo, "correo": correoElectronico, "celular": celular}
    }
    return usuario;
}

/**
* Función para usuario en Traccar
* @param {object} _usuario Objeto usuario para la crear en Traccar, ejemplo de la fucnion creaObjetoUsuarioTraccar.
* @return {int} Retorna valor entero que represnta el id creado en la tabla tc_users. Su hay error, retorna el objeto Error.
* History 
* v1.0 - Creación de la función. (PMA)
* @author Paul Martínez (PMA)
*/
function crearUsuarioTraccar(usuarioTraccar) {
    return new Promise((resolve, reject) => {
        const fullUrlTraccar = process.env.TRACCAR_PMA_URL + ":" + process.env.TRACCAR_PMA_PORT + "/api/users";
        const username = process.env.TRACCAR_PMA_USER;
        const passw = process.env.TRACCAR_PMA_PASS;

        var options = {
            url: fullUrlTraccar,
            json: true,
            auth: { username: username, password: passw },
            body: usuarioTraccar
        };

        request.post(options, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                //console.log(body);
                resolve(body.id);
            } else {
                console.log('Res.StatusCode: ' + res.statusCode);
                console.log("Error en traccar: " + err, body);
                reject(err);
            };
        });
    });
};

// Inserta Device en Traccar 
function crearDispositivoTraccar(_device) {
    return new Promise((resolve, reject) => {
        //console.log(device);

        const fullUrlTraccar = process.env.TRACCAR_PMA_URL + ":" + process.env.TRACCAR_PMA_PORT + "/api/devices";
        const username = process.env.TRACCAR_PMA_USER;
        const passw = process.env.TRACCAR_PMA_PASS;

        var options = {
            url: fullUrlTraccar,
            json: true,
            auth: { username: username, password: passw },
            body: _device
        };

        request.post(options, (err, res, body) => {
            if (!err) {
                if (res.statusCode == 200) {
                    console.log(body.id);
                    resolve(body.id);
                } else {
                    console.log('Res.StatusCode: ' + res.statusCode);
                    reject(res.body)
                };
            } else {
                console.log(err);
                reject(err);
            }
        });
    });
}

function crearRelacionUsuarioDispositivoTraccar(_traccar_tc_device_id, _cliente_id) {
    return new Promise((resolve, reject) => {
        const queryTcUserId = "SELECT traccar_tc_user_id FROM cliente WHERE id = " + _cliente_id;
        mysqlConnection.query(queryTcUserId, (err, rows) => {
            if (!err) {
                const traccar_tc_user_id = rows[0].traccar_tc_user_id;
                const fullUrlTraccar = process.env.TRACCAR_PMA_URL + ":" + process.env.TRACCAR_PMA_PORT + "/api/permissions";
                const username = process.env.TRACCAR_PMA_USER;
                const passw = process.env.TRACCAR_PMA_PASS;
                const _body = { "userId": traccar_tc_user_id, "deviceId": _traccar_tc_device_id }
                var options = {
                    url: fullUrlTraccar,
                    json: true,
                    auth: { username: username, password: passw },
                    body: _body
                };
                request.post(options, (err, res, body) => {
                    if (!err) {
                        if (res.statusCode == 204) {
                            //console.log(body.id);
                            resolve(true);
                        } else {
                            console.log('Res.StatusCode: ' + res.statusCode);
                            reject(res.body)
                        };
                    } else {
                        console.log(err);
                        reject(err);
                    }
                });

            } else {
                reject(err);
            }
        })
    })
}

function creaObjetoDispositivoTraccar(_name, _uniqueId, _phone, _model, _contact, _category, _attributes) {
    var disp = {
        "id": 1,
        "name": _name,
        "uniqueId": _uniqueId,
        "disabled": false,
        "lastUpdate": "",
        "positionId": null,
        "groupId": null,
        "phone": _phone,
        "model": _model,
        "contact": _contact,
        "category": _category,
        "geofenceIds": null,
        "attributes": _attributes
    }
    return disp
}
module.exports.creaObjetoUsuarioTraccar = creaObjetoUsuarioTraccar;
module.exports.creaObjetoDispositivoTraccar = creaObjetoDispositivoTraccar;
module.exports.crearUsuarioTraccar = crearUsuarioTraccar;
module.exports.validaExistenciaUsuarioTraccar = validaExistenciaUsuarioTraccar;
module.exports.crearRelacionUsuarioDispositivoTraccar = crearRelacionUsuarioDispositivoTraccar;
module.exports.crearDispositivoTraccar = crearDispositivoTraccar;
module.exports.validaExistenciaDispositivoTraccar = validaExistenciaDispositivoTraccar;



