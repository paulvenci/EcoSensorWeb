const mysqlConnection = require('../config/database');
const moment = require('../../node_modules/moment');
const funciones = require('./funciones')


function reporteVehiculo(_imei, _fechaInicio, _fechaFin) {
    return new Promise((resolve, reject) => {
        console.log('Entregando reporte...' + _imei, _fechaInicio, _fechaFin);
        const query = `call sp_Reporte_Vehiculo(?,?,?)`;
        mysqlConnection.query(query, [_imei, _fechaInicio, _fechaFin], (err, rows) => {
            if (!err) {
                var reporteFinal = [];

                // console.log(rows[0]);

                var respuesta = rows[0]

                // Resumen
                var velProm = 0;
                var velMax = 0;
                var ev = '';
                var sumaVelocidad = 0;
                var velocidadArr = [];
                var distancia = 0;
                var contSumVel = 0;
                var contSumTapa = 0;
                var contSumAcc = 0;
                var horas = 0;
                var hEntrada, hSalida;
                var strConCombIni, strConCombFin;

                respuesta.forEach((elemento, i, array) => {
                    // Evento apertura de tapa Combustible
                    if (elemento.conComb == '1' && i == 0) {
                        contSumTapa += 1;
                    }
                    if (i > 0) {
                        if (elemento.conComb == '1' && array[i - 1].conComb == '0') {
                            contSumTapa += 1;
                        }
                    }
                    // Evento ACC
                    ev = '';
                    if (elemento.conAcc == '1' && i == 0) {
                        contSumAcc += 1;
                        ev = 'e'
                        // console.log('evContAcc e ' + contSumAcc);
                    } else {
                        if (i > 0) {
                            if (elemento.conAcc == '1' && array[i - 1] == '0') {
                                ev = 'e';
                                // console.log('evContAcc e');

                            }
                            if (elemento.conAcc == '0' && array[i - 1].conAcc == '1') {
                                ev = 's';
                                // console.log('evContAcc s');

                            }
                        }
                        if (elemento.conAcc == '1' && i == array.length - 1) {
                            ev = 's'
                            // console.log('evContAcc s');

                        }
                    }

                    if (elemento.conAcc == '1' && i > 0 && i < array.length - 1) {
                        ev = 'i'
                        // console.log('evContAcc i');

                    }

                    switch (ev) {
                        case 'e':
                            hEntrada = moment(elemento.fechaHora)
                            break;

                        case 's':
                            hSalida = moment(elemento.fechaHora);
                            horas += moment.duration(hSalida.diff(hEntrada)).as('hours');
                            break;
                    }

                    vel = parseInt(elemento.velocidad);
                    //console.log('Velocidad= ' + String(vel));

                    velocidadArr.push(elemento.velocidad);
                    sumaVelocidad = sumaVelocidad + parseInt(elemento.velocidad);
                    contSumVel += 1;
                    if (i !== array.length - 1) {

                        if (elemento.latitud !== null && vel >= 1 && array[i + 1].latitud !== null && array[i + 1].longitud !== null) {

                            var distKm = getKilometros(elemento.latitud, elemento.longitud, array[i + 1].latitud, array[i + 1].longitud);

                            if (distKm !== NaN) {
                                if (distKm > 0.005) {
                                    distancia += parseFloat(distKm);
                                }
                            }
                        }
                    }

                })

                if (contSumVel > 0) {
                    velProm = funciones.promedio(velocidadArr, 1);
                    velMax = Math.max(...velocidadArr);
                }
                var resRepVeh = {
                    distancia: String(distancia.toFixed(3)).replace('.', ',') + ' km',
                    tiempoActivo: String(horas).replace('.', ',') + ' hr',
                    velocidadMaxima: String(velMax).replace('.', ',') + ' km/h',
                    velocidadPromedio: String(velProm).replace('.', ',') + ' km/h',
                    contSumTapa: contSumTapa,
                    contSumAcc: contSumAcc
                }

                // Inicio
                strOperarioIni = 'Sin Operario a bordo'
                if (respuesta[respuesta.length - 1].operadorNombre != null) {
                    strOperarioIni = respuesta[respuesta.length - 1].operadorNombre
                }
                strConAccIni = 'desconectado';
                if (respuesta[respuesta.length - 1].conAcc == '0') {
                    strConAccIni = 'conectado';
                }

                strConBatIni = 'desconectado';
                if (respuesta[respuesta.length - 1].conBat == '0') {
                    strConBatIni = 'conectado';
                }

                switch (respuesta[respuesta.length - 1].conComb) {
                    case '1':
                        strConCombIni = 'sensor tapa de combustible intervenido'
                        break;
                    case '2':
                        strConCombIni = 'tapa cerrada'
                        break;
                    case '3':
                        strConCombIni = 'tapa abierta'
                        break;
                }

                var inicio = {
                    fechaHora: respuesta[respuesta.length - 1].fecha,
                    latitud: respuesta[respuesta.length - 1].latitud,
                    longitud: respuesta[respuesta.length - 1].longitud,
                    velocidad: respuesta[respuesta.length - 1].velocidad,
                    conAcc: strConAccIni,
                    conBat: strConBatIni,
                    conComb: strConCombIni,
                    operadorNombre: strOperarioIni,
                    operadorRut: respuesta[respuesta.length - 1].operadorRut,
                    control_estado: respuesta[respuesta.length - 1].control_estado,
                    vehiculo_año: respuesta[respuesta.length - 1].vehiculo_ano,
                    vehiculo_color: respuesta[respuesta.length - 1].vehiculo_color,
                    vehiculo_patente: respuesta[respuesta.length - 1].vehiculo_patente,
                    vehiculo_dispositivo_imei: respuesta[respuesta.length - 1].vehiculo_dispositivo_imei,
                    vehiculo_horometro_inicial: respuesta[respuesta.length - 1].vehiculo_horometro_inicial,
                    vehiculo_km_inicial: respuesta[respuesta.length - 1].vehiculo_km_inicial,
                    vehiculo_marca: respuesta[respuesta.length - 1].vehiculo_marca,
                    vehiculo_modelo: respuesta[respuesta.length - 1].vehiculo_modelo,
                    vehiculo_nombre: respuesta[respuesta.length - 1].vehiculo_nombre,
                    vehiculo_tipo: respuesta[respuesta.length - 1].vehiculo_tipo
                }

                // Término
                strOperarioFin = 'Sin Operario a bordo'
                if (respuesta[0].operadorNombre != null) {
                    strOperarioFin = respuesta[0].operadorNombre
                }

                strConAccFin = 'desconectado';
                if (respuesta[0].conAcc == '0') {
                    strConAccFin = 'conectado';
                }

                strConBatFin = 'desconectado';
                if (respuesta[0].conBat == '0') {
                    strConBatFin = 'conectado';
                }

                switch (respuesta[0].conComb) {
                    case '1':
                        strConCombFin = 'sensor tapa de combustible intervenido'
                        break;
                    case '2':
                        strConCombFin = 'tapa cerrada'
                        break;
                    case '3':
                        strConCombFin = 'tapa abierta'
                        break;
                }
                var termino = {
                    fechaHora: respuesta[0].fecha,
                    latitud: respuesta[0].latitud,
                    longitud: respuesta[0].longitud,
                    velocidad: respuesta[0].velocidad,
                    conAcc: strConAccFin,
                    conBat: strConBatFin,
                    conComb: strConCombFin,
                    operadorNombre: strOperarioFin,
                    operadorRut: respuesta[0].operadorRut,
                    control_estado: respuesta[0].control_estado,
                    vehiculo_año: respuesta[0].vehiculo_ano,
                    vehiculo_color: respuesta[0].vehiculo_color,
                    vehiculo_patente: respuesta[0].vehiculo_patente,
                    vehiculo_dispositivo_imei: respuesta[0].vehiculo_dispositivo_imei,
                    vehiculo_horometro_inicial: respuesta[0].vehiculo_horometro_inicial,
                    vehiculo_km_inicial: respuesta[0].vehiculo_km_inicial,
                    vehiculo_marca: respuesta[0].vehiculo_marca,
                    vehiculo_modelo: respuesta[0].vehiculo_modelo,
                    vehiculo_nombre: respuesta[0].vehiculo_nombre,
                    vehiculo_tipo: respuesta[0].vehiculo_tipo
                }
                // Eventos
                let evento = [];
                let _comentario;
                let recorrido = []
                respuesta.reverse().forEach((elemento, indice, arreglo) => {
                    if (elemento.latitud !== null) {
                        recorrido.push([elemento.latitud, elemento.longitud])
                    }
                    //console.log(respuesta[indice].fecha);
                    if (indice < arreglo.length - 1) {
                        // Conexión Batería
                        if (elemento.conBat != arreglo[indice + 1].conBat) {

                            console.log('Conexión Batería');
                            // console.log('Valor 1: ' + String(elemento.conBat) + ', Fecha 1: ' + elemento.fecha);
                            // console.log('Valor 2: ' + String(arreglo[indice + 1].conBat) + ', Fecha 2: ' + arreglo[indice + 1].fecha);
                            if (elemento.conBat == '1') {
                                _comentario = 'desconexión de batería'
                            } else {
                                _comentario = 'conexión de batería'
                            }
                            ev = {
                                sensor: 'conexión batería',
                                estadoInicial: elemento.conBat,
                                estadoFinal: arreglo[indice + 1].conBat,
                                fechaEstadoInicial: elemento.fecha,
                                fechaEstadoFinal: arreglo[indice + 1].fecha,
                                latitud: elemento.latitud,
                                longitud: elemento.longitud,
                                velocidad: elemento.velocidad,
                                comentario: _comentario
                            }
                            // console.log(ev.sensor, ', ', _comentario);
                            evento.push(ev);
                        }
                        // Conexión Acc
                        if (elemento.conAcc != arreglo[indice + 1].conAcc) {
                            // console.log('Conexión Acc');
                            // console.log('Valor 1: ' + String(elemento.conAcc) + ', Fecha 1: ' + elemento.fecha);
                            // console.log('Valor 2: ' + String(arreglo[indice + 1].conAcc) + ', Fecha 2: ' + arreglo[indice + 1].fecha);
                            if (elemento.conAcc == '1') {
                                _comentario = 'desconexión de Acc'
                            } else {
                                _comentario = 'conexión de Acc'
                            }
                            ev = {
                                sensor: 'conexión Acc',
                                estadoInicial: elemento.conAcc,
                                estadoFinal: arreglo[indice + 1].conAcc,
                                fechaEstadoInicial: elemento.fecha,
                                fechaEstadoFinal: arreglo[indice + 1].fecha,
                                latitud: elemento.latitud,
                                longitud: elemento.longitud,
                                velocidad: elemento.velocidad,
                                comentario: _comentario
                            }
                            // console.log(ev.sensor, ', ', _comentario);
                            evento.push(ev);
                        }
                        //  conexión tapa combustible
                        // 1 => Tapa abierta
                        // 2 => Tapa cerrada
                        // 3 => Tapa intervenida
                        if (elemento.conComb != arreglo[indice + 1].conComb) {
                            // console.log('Conexión Tapa Combustible');
                            // console.log('Valor 1: ' + String(elemento.conComb) + ', Fecha 1: ' + elemento.fecha);
                            // console.log('Valor 2: ' + String(arreglo[indice + 1].conComb) + ', Fecha 2: ' + arreglo[indice + 1].fecha);
                            switch (arreglo[indice + 1].conComb) {
                                case '1':
                                    _comentario = 'sensor tapa de combustible intervenido'
                                    break;
                                case '2':
                                    _comentario = 'cierre tapa de combustible'
                                    break;
                                case '3':
                                    _comentario = 'apertura tapa de combustible'
                                    break;
                            }
                            ev = {
                                sensor: 'conexión tapa combustible',
                                estadoInicial: elemento.conComb,
                                estadoFinal: arreglo[indice + 1].conComb,
                                fechaEstadoInicial: elemento.fecha,
                                fechaEstadoFinal: arreglo[indice + 1].fecha,
                                latitud: elemento.latitud,
                                longitud: elemento.longitud,
                                velocidad: elemento.velocidad,
                                comentario: _comentario
                            }
                            // console.log(ev.sensor, ', ', _comentario);
                            evento.push(ev);
                        }
                        // operario
                        if (elemento.operadorRut != arreglo[indice + 1].operadorRut) {
                            // console.log('Operario');
                            // console.log('Valor 1: ' + String(elemento.operadorNombre) + ', Fecha 1: ' + elemento.fecha);
                            // console.log('Valor 2: ' + String(arreglo[indice + 1].operadorNombre) + ', Fecha 2: ' + arreglo[indice + 1].fecha);

                            if (elemento.operadorNombre != null) {
                                _comentario = 'salida de operario'
                            } else {
                                _comentario = 'entrada de operario'
                            }

                            ev = {
                                sensor: 'registro RFID operario',
                                estadoInicial: elemento.operadorNombre,
                                estadoFinal: arreglo[indice + 1].operadorNombre,
                                fechaEstadoInicial: elemento.fecha,
                                fechaEstadoFinal: arreglo[indice + 1].fecha,
                                latitud: elemento.latitud,
                                longitud: elemento.longitud,
                                velocidad: elemento.velocidad,
                                comentario: _comentario
                            }
                            // console.log(ev.sensor, ', ', _comentario);
                            evento.push(ev);
                        }
                    }
                });
                reporteFinal.push(inicio);
                reporteFinal.push(evento);
                reporteFinal.push(termino);
                reporteFinal.push(resRepVeh);
                reporteFinal.push(recorrido);
                // console.log(reporteFinal);
                resolve(reporteFinal);


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
                // console.log(rows.length);
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
                var distancia = 0;
                var sumaVelocidad = 0;
                var velocidad = [];
                var contSumVel = 0;
                var recArr = [];
                var velProm = 0;
                var velMax = 0;

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
                            if (element.latitud !== null && i !== array.length - 1) {
                                if (array[i + 1].latitud !== null) {
                                    var distKm = getKilometros(element.latitud, element.longitud, array[i + 1].latitud, array[i + 1].longitud);
                                    if (distKm > 0.005) {
                                        distancia += parseFloat(distKm);
                                    }
                                }
                            }
                            vel = parseInt(element.velocidad);
                            if (vel > 1) {
                                recArr.push([element.latitud, element.longitud]);
                                velocidad.push(element.velocidad);
                                sumaVelocidad = sumaVelocidad + parseInt(element.velocidad);
                                contSumVel += 1;

                            }
                            fullData.push(datos)

                            break;
                    }
                    evento = ''

                });


                if (contSumVel > 0) {
                    velProm = (sumaVelocidad / contSumVel).toFixed(1);
                    velMax = Math.max(...velocidad);
                }
                velProm = String(velProm).replace('.', ',') + ' km/h';
                velMax = String(velMax).replace('.', ',') + ' km/h';
                distancia = String(distancia.toFixed(3)).replace('.', ',') + ' km'
                horas = String(horas.toFixed(1)).replace('.', ',') + ' hrs';
                operario = {
                    distancia: distancia,
                    totalHoras: horas,
                    rangoTiempo: rango,
                    fullDataRep: fullData,
                    velMax: velMax,
                    velProm: velProm,
                    recorrido: recArr
                }
                //console.log(operario);

                resolve(operario);
            } else {
                console.log('Error: ' + err);
                reject = false;
            }
        })
    })
}

/**
 * \fn getKilometros().
 *
 * \Description: Devuelve la distancia en kilomegtros entre dos puntos dados por su latitud y longitud
 *
 * \param (integer) lat1 : Latitud del punto 1
 * \param (integer) long1 : Longitud del punto 1
 * \param (integer) lat2 : Latitud del punto 2
 * \param (integer) long2 : Longitud del punto 2
 *
 * \return (integer) Distancia en kilometros
 *
 **/

getKilometros = function (lat1, lon1, lat2, lon2) {
    rad = function (x) { return x * Math.PI / 180; }
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    if (d > 8000) {
        console.log('lat1: ' + String(lat1));
        console.log('lon1: ' + String(lon1));
        console.log('lat2: ' + String(lat2));
        console.log('lon2: ' + String(lon2));
        console.log(d.toFixed(3));

    }
    return d.toFixed(3); //Retorna tres decimales
}


module.exports.reporteVehiculo = reporteVehiculo;
module.exports.reporteOperario = reporteOperario;