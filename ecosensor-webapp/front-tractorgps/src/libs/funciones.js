var btoa = require('../../node_modules/btoa');
var atob = require('../../node_modules/atob');
let fs = require('fs');
const path = require('path');
const { resolve } = require('path');


function encrypt(texto) {
    crypted = btoa(texto);
    return crypted;
}

function decrypt(texto) {
    decrypted = atob(texto)
    return decrypted;
}
function promedio(arr, decimales) {
    var accSum = 0;
    var contSumVel = 0;
    arr.forEach(element => {
        if (element !== null && parseInt(element) >= 1) {
            accSum += parseInt(element);
            console.log(element);
            contSumVel += 1;
        }

    });
    console.log(accSum);
    console.log(contSumVel);

    var prom = String((accSum / contSumVel).toFixed(decimales)).replace('.', ',');


    return prom;

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

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.generatePassword = generatePassword;
module.exports.creaHtmlCorreoResetPass = creaHtmlCorreoResetPass;
module.exports.promedio = promedio;


