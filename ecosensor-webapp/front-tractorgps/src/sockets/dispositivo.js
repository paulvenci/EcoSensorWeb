
const { io } = require('../index');
const reporte = require('../libs/dispositivo');

io.on('connection', function (socket) {

    socket.on('dispositivoListar', (data) => {
        console.log('Socket ON => dispositivoListar(' + data.nombre_usuario + ')');

        dispositivo.dispositivoListar(data).then((result) => {
            console.log(result);
            socket.emit('dispositivoListar', result);

        });
    })
})