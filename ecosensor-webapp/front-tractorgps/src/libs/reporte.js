const mysqlConnection = require('../config/database');
const moment = require('../../node_modules/moment');


function reporteVehiculo(_imei, _fechaInicio, _fechaFin) {
    return new Promise((resolve, reject) => {
        console.log('Entregando reporte...' + _imei, _fechaInicio, _fechaFin);
        const query = `call sp_Reporte_Vehiculo(?,?,?)`;
        mysqlConnection.query(query, [_imei, _fechaInicio, _fechaFin], (err, rows) => {
            if (!err) {
                resolve(rows);
                //console.log(rows[0]);
            } else {
                console.log('Error: ' + err);
                reject = false;
            }
        })
    })
}

function reporteOperario(_fechaInicio, _fechaFin, _uidOperario) {
    return new Promise((resolve, reject) => {
        console.log('Entregando reporte...' + _fechaInicio, _fechaFin);
        const query = `select * from registro_sensor where fecha_hora >= ? and fecha_hora <= ?`;
        mysqlConnection.query(query, [_fechaInicio, _fechaFin], (err, rows) => {
            if (!err) {
                console.log(rows.length);
                var horaInicial;
                var horaFinal;
                var horaInter;
                var horas = 0;
                var entrada;
                var salida;
                var evento = '';
                var rango = [];
                var rangoEntrada;
                var rangoSalida;
                var fullData = [];
                var operario = [];

                rows.forEach((element, i, array) => {

                    // Entrada
                    if (i == 0 && element.dataS1 == _uidOperario) {
                        evento = 'e';
                    } else {

                        if (i == 0 && element.dataS1 != _uidOperario) {

                        } else {
                            if ((element.dataS1 == _uidOperario && array[i - 1].dataS1 != _uidOperario) || (i == 0 && element.dataS1 == _uidOperario)) {
                                evento = 'e';
                            }
                        }
                    }

                    // Salida
                    if (evento == '') {
                        if (i == array.length - 1 && element.dataS1 == _uidOperario) {
                            evento = 's'
                        } else {

                            if (i == array.length - 1 && element.dataS1 != _uidOperario) {

                            } else {
                                if ((element.dataS1 == _uidOperario && array[i + 1].dataS1 != _uidOperario) || (i == array.length && element.dataS1 == _uidOperario)) {
                                    evento = 's';
                                }
                            }
                        }
                    }

                    // Dentro del horario de trabajo  
                    if (evento == '') {
                        if ((element.dataS1 == _uidOperario) && (array[i - 1].dataS1 == _uidOperario) && (array[i + 1].dataS1 == _uidOperario)) {
                            evento = 'i';
                        }
                    }

                    // s1: rfid
                    // s2: bat 12v
                    // s3: acc
                    // s4: tapa comb
                    // s5: bat litio carga
                    strConBat = 'Desconectada';
                    if (element.dataS2 == 1) {
                        strConBat = 'Conectada'
                    }
                    strConAcc = 'Apagado';
                    if (element.dataS3 == 1) {
                        strConAcc = 'Encendido'
                    }
                    //* Tapa combustible
                    switch (element.dataS4) {
                        case '2':
                            strTapaComb = 'Cerrada';
                            break;
                        case '3':
                            strTapaComb = 'Abierta';
                            break;
                        case '1':
                            strTapaComb = 'Intervenida';
                            break;
                    }

                    var datos = {
                        imei: element.imei,
                        latitud: element.latitud,
                        longitud: element.longitud,
                        fechaHora: element.fecha_hora,
                        velocidad: element.velocidad,
                        altura: element.altura,
                        uid: element.dataS1,
                        conBat: strConBat,
                        conAcc: strConAcc,
                        tapaComb: strTapaComb
                    }

                    switch (evento) {
                        case 'e':
                            horaInicial = element.fecha_hora;
                            // console.log('Hora Inicial: ' + horaInicial, 'id: ' + String(element.id));
                            entrada = moment(horaInicial);
                            rangoEntrada = horaInicial;
                            fullData.push(datos)

                            break;

                        case 's':
                            horaFinal = element.fecha_hora;
                            salida = moment(horaFinal);
                            // console.log('Hora Final: ' + horaFinal, 'id: ' + String(element.id));
                            horas += moment.duration(salida.diff(entrada)).as('hours');
                            console.log(horas);
                            rangoSalida = horaFinal;
                            mirango = {
                                rangoEntrada: rangoEntrada,
                                rangoSalida: rangoSalida
                            }
                            rango.push(mirango);
                            fullData.push(datos)

                            console.log(mirango);

                            break;
                        case 'i':
                            horaInter = element.fecha_hora;
                            fullData.push(datos)
                            break;
                    }
                    evento = ''
                });

                console.log('Total Horas: ' + String(horas));

                operario = {
                    totalHoras: horas,
                    rangoTiempo: rango,
                    fullDataRep: fullData
                }
                console.log(operario);

                resolve(operario);
            } else {
                console.log('Error: ' + err);
                reject = false;
            }
        })
    })
}



module.exports.reporteVehiculo = reporteVehiculo;
module.exports.reporteOperario = reporteOperario;