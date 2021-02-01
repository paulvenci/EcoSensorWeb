var request = require('../../node_modules/request');
var btoa = require('../../node_modules/btoa');
var atob = require('../../node_modules/atob');
let fs = require('fs');
const path = require('path');
const strg = require('../../node_modules/replace-string');
const { resolve } = require('path');


function encrypt(texto) {
    crypted = btoa(texto);
    return crypted;
}

function decrypt(texto) {
    decrypted = atob(texto)
    return decrypted;
}

function enviaMail(_destinatario, _asunto, _texto, _html) {
    return new Promise((resolve, reject) => {
        // TODO Crear process env para esto
        request.post('http://localhost:4001' + '/api/email/interno', { //process.env.HOSTSERV + '/api/email/interno',
            json: {
                'destinatario': _destinatario,
                'asunto': _asunto,
                'texto': _texto,
                'html': _html
            }
        }, (error, res, body) => {
            if (!error) {
                //Llamar a función que actualiza cobroCAB a 2 (correo enviado)
                resolve(true);
            } else {
                console.log(error);
                reject(false)
            }
        });
    })
}

function leerArchivo(_archivo) {
    return new Promise((resolve, reject) => {
        fs.readFile(_archivo, 'utf-8', (err, data) => {
            if (err) {
                console.log('error: ', err);
                reject(err);
            } else {
                //console.log(data);
                resolve(data);
            }
        });
    })
}

function generatePassword(length, charSet) {
    charSet = charSet ? charSet : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.apply(null, Array(length || 10)).map(function () {
        return charSet.charAt(Math.random() * charSet.length);
    }).join('');
}


function creaHtmlCorreoResetPass(_usuario, _nombre, _pass) {
    return new Promise((resolve, reject) => {
        leerArchivo(path.join(__dirname, '..', 'htmlResetPass.html')).then((val) => {
            var html;
            html = strg(val, "NOMBRE", _nombre);
            html = strg(html, "USER", _usuario);
            html = strg(html, "PASS", _pass);
            //console.log(html);
            resolve(html);
        }, (error) => {
            reject(error)
        })
    })
}

module.exports.enviaMail = enviaMail;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.generatePassword = generatePassword;
module.exports.creaHtmlCorreoResetPass = creaHtmlCorreoResetPass;


