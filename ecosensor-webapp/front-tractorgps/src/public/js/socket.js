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

    //
    // ─── TABLERO ────────────────────────────────────────────────────────────────────
    //
    socket.on('estadoDispositivo', (data) => {
        console.log('estadoDispositivo => On');
        dispositivoListar(data);
        console.log(tarjetaCreada);
        switch (pestaña) {
            case 'tablero':
                if (tarjetaCreada) {
                    actualizaTablero();
                } else {
                    cargaTableroCard();
                }
                break;
            case 'reporte':
                vehiculoSelect();
                break;
            case 'mapa':
                recargaMapa();
                break;
        }

    });

    //
    // ─── REPORTE ────────────────────────────────────────────────────────────────────
    //
    socket.on('reporteVehiculo', (data) => {
        reporteVehiculo(data.reporteFinal);
    })

    socket.on('operarioLista', (data) => {
        // console.log('Socket ON = operarioLista' + data);
        operarioListar(data);
        operarioSelect();
    })

    socket.on('reporteOP', (data) => {
        console.log(data);
        reporteOperario(data);
    })

    //
    // ─── MAPA ───────────────────────────────────────────────────────────────────────
    //



    // Operario

    // Dispositivos

}