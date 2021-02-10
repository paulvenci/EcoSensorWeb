const { io } = require('../index');
const operario = require('../libs/operario');

io.on('connection', function (socket) {

    socket.on('operarioLista', (data) => {
        console.log('Socket ON => operarioLista(' + data.userName + ')');

        operario.operarioLista(data.userName).then((result) => {
            console.log(result);
            socket.emit('operarioLista', result);

        });
    })

})