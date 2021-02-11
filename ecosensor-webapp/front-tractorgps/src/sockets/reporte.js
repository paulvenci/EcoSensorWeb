const { io } = require('../index');
const reporte = require('../libs/reporte');

io.on('connection', function (socket) {

    socket.on('reporteOP', (data) => {
        console.log('===== Emitiendo Reporte =====');
        var uid = data.uid;
        var fechaInicio = data.fechaInicio;
        var fechaTermino = data.fechaTermino;
        reporte.reporteOperario(fechaInicio, fechaTermino, uid)
            .then((val) => {
                console.log('Entregando reporte operario...');
                socket.emit("reporteOP", { val })
            }, (err) => {
                console.log('Error: ' + err);
            })
    })

    socket.on('reporteVehiculo', (data) => {
        console.log('===== Emitiendo Reporte =====');
        var fechaInicio = data.fechaInicio;
        var fechaTermino = data.fechaTermino;
        reporte.reporteVehiculo(data.imei, fechaInicio, fechaTermino).
            then((val) => {
                console.log('Entregando reporte vehiculo...');
                socket.emit('reporteVehiculo', { val });

            }, (err) => {
                // Error en
                console.log('Error: ' + err);
            })
    })
})

