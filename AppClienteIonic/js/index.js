
// Variables globales
let iniciado = 0;
let myVar;
let socket = io();
// Obteniendo objetos del DOM
let contenidoBody = document.getElementById("contenidoBody");
let contenidoMain;
let btnTablero;
let btnReporte;
let btnMapa;
let mySidebar;
let overlayBg;
let usr;
let usuario_nombreUsuario;
let usuario_pass;
//let reporte = require('./libs/reporte')

// 1) Carga Menú
// cargaMenu();

// 2) Carga datos de usuario
// cargaUsuario();

// 3) Carga datos dispositivos
// cargaDispositivos(usuario.id);

// 3.1) Carga sensores
// cargaSensores()

// 3.2) Carga controles

// 4) Carga datos de usuario

// 5) Carga alertas

window.addEventListener('load', function () {
    cargaSocketOn();
    desplpiegaLogin();
});

function cargaSocketEmit() {
    socket.emit('obtieneDatosUsuario',
        {
            username: 'paulvenci',
            pass: 'uvas8827'
        })
}

function cargaSocketOn() {
    socket.on('login', function (data) {
        resultValidarUsuario(data);
    });

    socket.on('obtieneUbicacion', function (data) {
        obtieneUbicacion(data)
    });

    socket.on('obtieneDatosUsuario', function (data) {
        usuarioDespliega(data);
    });

    socket.on('dispositivoListar', function (data) {
        dispositivoListar(data);
    })
}

function cargaContenido(data) {
    usr = data.objeto;
    $('#contenidoBody').load('/html/contenido.html');
    iniciado = 0;
    clearInterval(myVar);
    console.log(data.objeto.nombreCompleto);

}
function cargaDatos(datos) {
    $('#usuarioNombreCompleto').html(datos.nombreCompleto);
    resaltaBoton("tablero");
    console.log(usuario_nombreUsuario);

    socket.emit('dispositivoListar', {
        nombre_usuario: usuario_nombreUsuario
    })
}

function cargaTablero() {
    $('#tablero').remove();
    $('#reporte').remove();
    $('#mapa').remove();
    $('#contenidoMain').load('/html/tablero.html')

    iniciado = 0;
    clearInterval(myVar);

    // Resalta color del botón del menú
    resaltaBoton("tablero");
}

function cargaReporte() {

    $('#tablero').remove();
    $('#reporte').remove();
    $('#mapa').remove();
    $('#contenidoMain').load('/html/reporte.html')
    iniciado = 0;
    clearInterval(myVar);

    // Resalta color del botón del menú
    resaltaBoton("reportes");
}

function cargaMapa(_inicia) {
    clearInterval(myVar);

    $('#tablero').remove();
    $('#reporte').remove();
    $('#mapa').remove();
    $('#contenidoMain').load('/html/mapa.html')

    //  recarga();
    // myVar = setInterval(recarga, 5000);

    // Resalta color del botón del menú
    resaltaBoton("mapa");
}


