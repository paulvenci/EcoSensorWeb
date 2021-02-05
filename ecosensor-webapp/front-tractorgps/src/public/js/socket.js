let socket;
function socketContectar(ipServer, portServer) {
    socket = io(ipServer + ':' + portServer)
}
function socketDesconectar(ipServer, portServer) {
    socket.disconnect();
}
function socketON() {
    socket.on('connect', () => {
        console.log('Conexión establecida, id: ' + socket.id);
    })

    socket.on('disconnect', (reason) => {
        console.log('Desconectado, ' + reason);
    })

    socket.on('connect_error', (err) => {
        if (err.message === 'invalid credentials') {
            socket.auth.token = 'token';
            socket.connect();
        }

    })
}