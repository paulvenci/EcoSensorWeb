function obtieneUbicacion(data) {
    alert("Carga SOCKET " + data);

}
function cargaReporte() {
    $('#reporte').load('html/reporte.html');
}

function muestraReporteEmit() {
    var _imei = '867372058709564'
    var _fechaInicio = moment(document.querySelector('#fechaInicio').value).format('YYYY-MM-DD HH:mm:ss');
    var _fechaTermino = moment(document.querySelector('#fechaTermino').value).format('YYYY-MM-DD HH:mm:ss');
    console.log(_fechaInicio, _fechaTermino);

    socket.emit('reporteVehiculo',
        {
            imei: _imei,
            fechaInicio: _fechaInicio,
            fechaTermino: _fechaTermino
        })
}
function cargaReporteON() {
    socket.on('reporteVehiculo', (data) => {
        console.log(data);

    })
}

