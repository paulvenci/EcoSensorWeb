const { io } = require('../index');
const usuario = require('../models/usuario');
const dispositivo = require('../libs/dispositivo');
const reporte = require('../libs/reporte');
const tractorgps = require('../libs/tractorgps');
const socketioJwt = require('../../node_modules/socketio-jwt');

io.on('connection', function (socket) {

    // socket.emit('obtieneUbicacion', "HOLA desde SErver");
    socket.on('mensaje', (data) => {
        console.log('Nueva conexión...');
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
                    vehiculo_año: val[i].vehiculo_ano,
                    vehiculo_dispositivo_imei: val[i].vehiculo_dispositivo_imei,
                    vehiculo_horometro_inicial: val[i].vehiculo_horometro_inicial
                }
                dispositivos.push(item);
            }
            console.log(dispositivos[0].fecha);

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
})