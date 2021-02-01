
//WebSocket
const SocketIo = require('socket.io');
const io = SocketIo(server);

io.on('connection', function (socket) {
    console.log('Nueva conexión...');


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

})

module.exports = Socket_Io;