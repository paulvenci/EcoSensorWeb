const { io } = require('../index');
const usuario = require('../models/usuario');
const dispositivo = require('../libs/dispositivo');
const reporte = require('../libs/reporte');
const tractorgps = require('../libs/tractorgps');
const socketioJwt = require('../../node_modules/socketio-jwt');

io.on('connection', function (socket) {

    // socket.emit('obtieneUbicacion', "HOLA desde SErver");
    console.log('Nueva conexión...');
    socket.on('mensaje', (data) => {
        console.log('Mensaje: ' + data.mensaje);
        socket.emit('mensaje', {
            mensaje: 'Conexión con server establecida'
        })

    })
    socket.on('login', (data) => {
        usuario.findByUsername(data.usuario, data.password).then((resul) => {
            console.log(resul);
            socket.emit('login', (resul));
        })

    })
    socket.on('dispositivoListar', (data) => {
        console.log('Socket ON => dispositivoListar(' + data.nombre_usuario + ')');

        dispositivo.dispositivoListar(data).then((result) => {
            console.log(result);
            socket.emit('dispositivoListar', result);

        });
    })

    socket.on('reporteOP', (data) => {
        console.log('===== Emitiendo Reporte =====');

        var rut = data.rut;
        var fechaInicio = data.fechaInicio;
        var fechaFin = data.fechaFin;

        tractorgps.reporteOperario(fechaInicio, fechaFin, rut)
            .then((val) => {
                console.log('Entregando reporte...');

                //console.log(val);

                socket.emit("reporteOP", { val })

            }, (err) => {
                console.log('Error: ' + err);

            })
    })

    socket.on('actualizaControl', (data) => {
        tractorgps.actualizaControl(data.imei, data.estado).then((val) => {
            if (val) {
                console.log('Control actualizado');

            }
        })
    })

    // s1: rfid
    // s2: bat 12v
    // s3: acc
    // s4: tapa comb
    // s5: bat litio carga
    socket.on('estadoDispositivo', (data) => {
        console.log('Reciviendo data: ' + data.userName);
        dispositivo.estadoDispositivo(data.userName).then((val) => {
            // Devuelve la ubicación de todos los dispositivos del usuario
            let dispositivos = [];
            for (var i = 0; i < val.length; i++) {
                let item = {};
                item = {
                    nombreUsuario: data.userName,
                    imei: val[i].imei,
                    latitud: val[i].latitud,
                    longitud: val[i].longitud,
                    velocidad: val[i].velocidad,
                    conAcc: val[i].conAcc,
                    conBat: val[i].conBat,
                    conComb: val[i].conComb,
                    operadorNombre: val[i].operadorNombre,
                    operadorRut: val[i].operadorRut,
                    fecha: val[i].fecha,
                    control1: val[i].control_estado,
                    vehiculo_nombre: val[i].vehiculo_nombre,
                    vehiculo_patente: val[i].vehiculo_patente,
                    vehiculo_marca: val[i].vehiculo_marca,
                    vehiculo_modelo: val[i].vehiculo_modelo,
                    vehiculo_color: val[i].vehiculo_color,
                    vehiculo_tipo: val[i].vehiculo_tipo,
                    vehiculo_km_inicial: val[i].vehiculo_km_inicial,
                    vehiculo_año: val[i].vehiculo_año,
                    vehiculo_dispositivo_imei: val[i].vehiculo_dispositivo_imei,
                    vehiculo_horometro_inicial: val[i].vehiculo_horometro_inicial
                }
                dispositivos.push(item);
            }
            socket.emit('estadoDispositivo', { dispositivos });

        }, (err) => {
            console.log('Error: ' + err);
        })
    })

    socket.on('ubicacion', (data) => {
        console.log('Reciviendo data: ' + data);
        let _nombreUsuario = data.nombreUsuario;
        // 1) Autenticación
        // 2) Petición de ubicación => Respuesta de ubicación
        tractorgps.autenticar(data.userName, data.password)
            .then((val) => {
                if (val) {
                    //Autenticación correcta
                    tractorgps.ubicacion(data.userName).then((val) => {
                        // Devuelve la ubicación de todos los dispositivos del usuario
                        let dispositivos = [];
                        for (var i = 0; i < val.length; i++) {
                            let item = {};
                            item = {
                                nombreUsuario: data.userName,
                                imei: val[i].imei,
                                latitud: val[i].latitud,
                                longitud: val[i].longitud,
                                velocidad: val[i].velocidad,
                                conAcc: val[i].conAcc,
                                conBat: val[i].conBat,
                                operadorNombre: val[i].operadorNombre,
                                operadorRut: val[i].operadorRut,
                                fecha: val[i].fecha,
                                control1: val[i].control_estado
                            }
                            dispositivos.push(item);
                        }
                        socket.emit('ubicacion', { dispositivos });

                    }, (err) => {
                        console.log('Error: ' + err);

                    })
                } else {
                    //Autenticación incorrecta

                }
            }, (err) => {
                //Error en autenticación
                console.log('Error: ' + err);

            })

    })

    socket.on('reporteVehiculo', (data) => {
        console.log('datos: ' + data.imei);
        var reporteFinal = [];
        reporte.reporteVehiculo(data.imei, data.fechaInicio, data.fechaTermino).then((val) => {
            var respuesta = val[0]
            //   console.log(respuesta[respuesta.length - 1].fecha);

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
            respuesta.reverse().forEach((elemento, indice, arreglo) => {

                //console.log(respuesta[indice].fecha);
                if (indice < arreglo.length - 1) {
                    // Conexión Batería
                    if (elemento.conBat != arreglo[indice + 1].conBat) {

                        console.log('Conexión Batería');
                        console.log('Valor 1: ' + String(elemento.conBat) + ', Fecha 1: ' + elemento.fecha);
                        console.log('Valor 2: ' + String(arreglo[indice + 1].conBat) + ', Fecha 2: ' + arreglo[indice + 1].fecha);
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
                        console.log(ev.sensor, ', ', _comentario);
                        evento.push(ev);
                    }
                    // Conexión Acc
                    if (elemento.conAcc != arreglo[indice + 1].conAcc) {
                        console.log('Conexión Acc');
                        console.log('Valor 1: ' + String(elemento.conAcc) + ', Fecha 1: ' + elemento.fecha);
                        console.log('Valor 2: ' + String(arreglo[indice + 1].conAcc) + ', Fecha 2: ' + arreglo[indice + 1].fecha);
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
                        console.log(ev.sensor, ', ', _comentario);
                        evento.push(ev);
                    }
                    //  conexión tapa combustible
                    // 1 => Tapa abierta
                    // 2 => Tapa cerrada
                    // 3 => Tapa intervenida
                    if (elemento.conComb != arreglo[indice + 1].conComb) {
                        console.log('Conexión Tapa Combustible');
                        console.log('Valor 1: ' + String(elemento.conComb) + ', Fecha 1: ' + elemento.fecha);
                        console.log('Valor 2: ' + String(arreglo[indice + 1].conComb) + ', Fecha 2: ' + arreglo[indice + 1].fecha);
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
                        console.log(ev.sensor, ', ', _comentario);
                        evento.push(ev);
                    }
                    // operario
                    if (elemento.operadorRut != arreglo[indice + 1].operadorRut) {
                        console.log('Operario');
                        console.log('Valor 1: ' + String(elemento.operadorNombre) + ', Fecha 1: ' + elemento.fecha);
                        console.log('Valor 2: ' + String(arreglo[indice + 1].operadorNombre) + ', Fecha 2: ' + arreglo[indice + 1].fecha);

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
                        console.log(ev.sensor, ', ', _comentario);
                        evento.push(ev);
                    }
                }
            });
            reporteFinal.push(inicio);
            reporteFinal.push(evento);
            reporteFinal.push(termino);
            console.log(reporteFinal);
            socket.emit('reporteVehiculo', { reporteFinal });

        }, (err) => {
            // Error en
            console.log('Error: ' + err);

        })
    })

})