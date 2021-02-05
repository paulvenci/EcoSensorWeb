

function obtieneUbicacion(data) {
    alert("Carga SOCKET " + data);

}
function cargaReporte() {
    $('#reporte').load('html/reporte.html');

}

function muestraReporteEmit() {

    _fechaInicio = moment(document.querySelector('#fechaInicio').value).format('YYYY-MM-DD');
    _fechaTermino = moment(document.querySelector('#fechaTermino').value).format('YYYY-MM-DD');
    _horaInicio = moment(document.querySelector('#horaInicio').value).format('HH:mm');
    _horaTermino = moment(document.querySelector('#horaTermino').value).format('HH:mm');
    vehiculo = document.getElementById('selectVehiculo');
    _imei = vehiculo.value.imei;
    _fechaInicio = _fechaInicio + ' ' + _horaInicio;
    _fechaTermino = _fechaTermino + ' ' + _horaTermino;

    socket.emit('reporteVehiculo',
        {
            imei: _imei,
            fechaInicio: _fechaInicio,
            fechaTermino: _fechaTermino
        })
}
function cargaReporteON() {
    socket.on('reporteVehiculo', (data) => {
        console.log(data.reporteFinal);
        reporteVehiculo(data.reporteFinal);

    })
    socket.on('estadoDispositivo', (data) => {
        // console.log('estadoDispositivo => On');
        dispositivoListar(data);
        vehiculoSelect();
    })
    vehiculo = document.getElementById('selectVehiculo');
    operario = document.getElementById('selectOperario');
    vehiculo.disabled = false;
    operario.disabled = true;
}

function reporteVehiculo(data) {
    // Inicio
    iniReporte = document.querySelector('#iniRep');
    let strIniciaRep = inicioRep(data);
    let eleIniRep = document.createElement("div");
    eleIniRep.innerHTML = strIniciaRep;
    iniReporte.appendChild(eleIniRep);

    // Evento
    eveReporte = document.querySelector('#eveRep');
    let strEventoRep = eventoRep(data);
    let eleEveRep = document.createElement("div");
    eleEveRep.innerHTML = strEventoRep;
    eveReporte.appendChild(eleEveRep);

    // Termino
    finReporte = document.querySelector('#finRep');
    let strTerminoRep = terminoRep(data);
    let eleFinRep = document.createElement("div");
    eleFinRep.innerHTML = strTerminoRep;
    finReporte.appendChild(eleFinRep);
}

function habilitaVehiculoSel() {
    vehiculo = document.getElementById('selectVehiculo');
    operario = document.getElementById('selectOperario');
    vehiculo.disabled = false;
    operario.disabled = true;
}
function habilitaOperarioSel() {
    vehiculo = document.getElementById('selectVehiculo');
    operario = document.getElementById('selectOperario');
    vehiculo.disabled = true;
    operario.disabled = false;
}


function vehiculoSelect() {
    let compareWithFnV = (o1, o2) => {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    vehiculo = document.getElementById('selectVehiculo');

    $('#selectVehiculo').empty();

    vehiculo.disabled = false;
    dispositivos.compareWith = compareWithFnV;
    dispositivos.forEach((option, i) => {
        let selectOption = document.createElement('ion-select-option');
        selectOption.value = option;
        selectOption.textContent = option.vehiculo_tipo.toUpperCase() + ', ' + option.vehiculo_marca.toUpperCase() + ', ' + option.vehiculo_modelo.toUpperCase() + ', ' + option.vehiculo_patente.toUpperCase();
        vehiculo.appendChild(selectOption);
    });

    vehiculo.value = dispositivos[0];
}
function operarioSelect() {
    let compareWithFnO = (o1, o2) => {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }
    operario = document.getElementById('selectOperario');
    $('#selectOperario').empty();
    operario.disabled = true;
    // dispositivos.compareWith = compareWithFnO;
    // dispositivos.forEach((option, i) => {
    //     let selectOption = document.createElement('ion-select-option');
    //     selectOption.value = option;
    //     selectOption.textContent = option.vehiculo_tipo.toUpperCase() + ', ' + option.vehiculo_marca.toUpperCase() + ', ' + option.vehiculo_modelo.toUpperCase() + ', ' + option.vehiculo_patente.toUpperCase();
    //     operario.appendChild(selectOption);
    // });

    // vehiculo.value = dispositivos[0];
}
function funcionId() {
    console.log(vehiculo.value.imei);
}
function eventoRep(datos) {
    let ini = `
            <ion-card style="background-color: rgb(255, 202, 103);">
            <ion-card-header>
            <ion-card-title> Eventos de actividades </ion-card-title>
            </ion-card-header>
            <ion-card-content>
            `;
    let fin = `
            </ion-card-content>
            </ion-card>
            `;
    let tarjetaEvento = '';

    datos[1].forEach((dato, i, arreglo) => {
        var fecha = moment(dato.fechaEstadoFinal).format('DD-MM-YYYY HH:mm');
        var nombreEvento = dato.sensor;
        var comentarioEvento = dato.comentario;
        var latitudEvento = dato.latitud;
        var longitudEvento = dato.longitud;
        var velocidadEvento = dato.velocidad;
        var valorEvento = dato.estadoFinal;

        if (nombreEvento == 'registro RFID operario') {
            if (comentarioEvento == 'salida de operario') {
                valorEvento = dato.estadoInicial;
            } else {
                valorEvento = dato.estadoFinal;
            }
        } else {
            valorEvento = '';
        }

        tarjetaEvento +=
            `
            <ion-card class = "ion-padding"> 
                <h2>` + fecha + `</h2>
                <h2>` + nombreEvento + `</h2>
                <h2>` + comentarioEvento + `</h2>
                <h2>` + valorEvento + `</h2>
                <ion-row class="ion-justify-content-center">
                    <ion-button size="small" fill="outline" id="pos-` + i + `&` + latitudEvento + ',' + longitudEvento + `" onclick ="localizarReporte(this.id);">
                        <ion-icon slot="start" name="location"></ion-icon> Posición</ion-button>
                </ion-row>    
            </ion-card>
            `
    })
    // <ion-button id="pos-` + i + `[` + latitudEvento + ',' + longitudEvento + `]" onclick ="localizarReporte(this.id);">Posición</ion-button>
    let tarjetaEventoCompleta = ini + tarjetaEvento + fin;
    return (tarjetaEventoCompleta);

}

function localizarReporte(_id) {
    var n = _id.indexOf('&');
    var m = _id.indexOf(',');
    var lat = _id.slice(n + 1, m);
    var lon = _id.slice(m + 1, m + 11)
    console.log('lat: ' + lat);
    console.log('lon: ' + lon);
    dispo = {

    }
    createModalMapaReporte(lat, lon);
}

async function createModalMapaReporte(_lat, _lon) {
    const modal = await modalController.create({
        component: 'modal-content-mapa'
    });

    await modal.present();
    currentModal = modal;
    iniciaMapaModal(_lat, _lon, 'GM1');
    iniciaMarcaModal(_lat, _lon);
}

function iniciaMarcaModal(_lat, _lon) {
    var lati = parseFloat(_lat);
    var long = parseFloat(_lon);
    var markerModal;
    markerModal = L.marker([lati, long], { icon: greenIcon })
        .addTo(myMapModal)
    // .bindPopup(
    //     '<strong>Operario</strong>: ' + dispositivos[_i].operadorNombre + `<br>
    //          <strong>Velocidad</strong>: ` + dispositivos[_i].velocidad + ` km/h<br>
    //          <strong>Conexión Bateria</strong>: ` + dispositivos[_i].conBat + `<br>
    //          <strong>Contacto</strong>: ` + dispositivos[_i].conAcc + `<br>
    //          <strong>Tapa Comb</strong>: ` + dispositivos[_i].conComb + `<br>
    //          <strong>Últ. conexión</strong>: ` + dispositivos[_i].fecha)
    //myMap.on('click', function () { })
}


function terminoRep(datos) {
    _fechaInicio = moment(document.querySelector('#fechaInicio').value).format('YYYY-MM-DD');
    _fechaTermino = moment(document.querySelector('#fechaTermino').value).format('YYYY-MM-DD');
    _horaInicio = moment(document.querySelector('#horaInicio').value).format('HH:mm');
    _horaTermino = moment(document.querySelector('#horaTermino').value).format('HH:mm');
    vehiculo = document.getElementById('selectVehiculo');
    _imei = vehiculo.value.imei;
    _fechaInicio = _fechaInicio + ' ' + _horaInicio;
    _fechaTermino = _fechaTermino + ' ' + _horaTermino;

    let tarjetaReporteTermino =
        `
            <ion-col class="ion-no-padding" size = "12" size-lg="3" size-sm="6" >
                <ion-card style="background-color: rgb(236, 236, 236);">
                    <ion-card-header>
                        <ion-button fill="clear" expand="full">
                            <ion-icon slot=" start" name="car" size="large">
                            </ion-icon> Termino de trayecto
            </ion-button>
                        <ion-card-subtitle class="ion-text-center">` + _fechaTermino + ` </ion-card-subtitle>
                    </ion-card-header>
                    <ion-grid>
                        <ion-row class="rowCard">
                            <ion-col size="4">
                                <ion-label class="divCard">Operario</ion-label>
                            </ion-col>
                            <ion-col>
                                <ion-label class="divCard"> ` + datos[2].operadorNombre + `</ion-label>
                            </ion-col>
                        </ion-row>
                        <hr class="hrCard">

                            <ion-row class="rowCard">
                                <ion-col size="4">
                                    <ion-label class="divCard">Velocidad</ion-label>
                                </ion-col>
                                <ion-col>
                                    <ion-label class="divCard">` + datos[2].velocidad + `</ion-label>
                                </ion-col>
                            </ion-row>
                            <hr class="hrCard">

                                <ion-row class="rowCard">
                                    <ion-col size="4">
                                        <ion-label class="divCard">Acc</ion-label>
                                    </ion-col>
                                    <ion-col>
                                        <ion-label class="divCard"> ` + datos[2].conAcc + ` </ion-label>
                                    </ion-col>
                                </ion-row>
                                <hr class="hrCard">

                                    <ion-row class="rowCard">
                                        <ion-col size="4">
                                            <ion-label class="divCard">Batería</ion-label>
                                        </ion-col>
                                        <ion-col>
                                            <ion-label class="divCard"> ` + datos[2].conBat + ` </ion-label>
                                        </ion-col>
                                    </ion-row>
                                    <hr class="hrCard">

                                        <ion-row class="rowCard">
                                            <ion-col size="4">
                                                <ion-label class="divCard">Tapa Comb</ion-label>
                                            </ion-col>
                                            <ion-col>
                                                <ion-label style="padding-right: 10px;" class="divCard">  ` + datos[2].conComb + ` </ion-label>
                                                <ion-icon size="medium" color="danger" name="alert-circle">
                                                </ion-icon>
                                            </ion-col>
                                        </ion-row>
                                        <hr class="hrCard">

                                            <ion-row class="rowCard">
                                                <ion-col size="4">
                                                    <ion-label class="divCard">Imei</ion-label>
                                                </ion-col>
                                                <ion-col>
                                                    <ion-label class="divCard"> ` + _imei + ` </ion-label>
                                                </ion-col>
                                            </ion-row>
                                            <hr class="hrCard">

                                                <ion-row class="ion-justify-content-center">
                                                    <ion-button size="small" fill="outline" id="pos-termino&` + datos[2].latitud + ',' + datos[2].longitud + `" onclick ="localizarReporte(this.id);">
                                                        <ion-icon slot="start" name="location"></ion-icon> Posición
                </ion-button>
                                                </ion-row>

        </ion-grid>
    </ion-card>
</ion-col>
`
    return (tarjetaReporteTermino);
}

function inicioRep(datos) {
    _fechaInicio = moment(document.querySelector('#fechaInicio').value).format('YYYY-MM-DD');
    _fechaTermino = moment(document.querySelector('#fechaTermino').value).format('YYYY-MM-DD');
    _horaInicio = moment(document.querySelector('#horaInicio').value).format('HH:mm');
    _horaTermino = moment(document.querySelector('#horaTermino').value).format('HH:mm');
    vehiculo = document.getElementById('selectVehiculo');
    _imei = vehiculo.value.imei;
    _fechaInicio = _fechaInicio + ' ' + _horaInicio;
    _fechaTermino = _fechaTermino + ' ' + _horaTermino;

    let tarjetaReporteInicio =
        `
    <ion-col class="ion-no-padding" size="12" size-lg="3" size-sm="6">
                                        <ion-card style="background-color: rgb(236, 236, 236);">
                                            <ion-card-header>
                                                <ion-button fill="clear" expand="full">
                                                    <ion-icon slot=" start" name="car" size="large">
                                                    </ion-icon> Inicio de trayecto
            </ion-button>
                                                <ion-card-subtitle class="ion-text-center">` + _fechaInicio + ` </ion-card-subtitle>
                                            </ion-card-header>
                                            <ion-grid>
                                                <ion-row class="rowCard">
                                                    <ion-col size="4">
                                                        <ion-label class="divCard">Operario</ion-label>
                                                    </ion-col>
                                                    <ion-col>
                                                        <ion-label class="divCard"> ` + datos[0].operadorNombre + `</ion-label>
                                                    </ion-col>
                                                </ion-row>
                                                <hr class="hrCard">

                                                    <ion-row class="rowCard">
                                                        <ion-col size="4">
                                                            <ion-label class="divCard">Velocidad</ion-label>
                                                        </ion-col>
                                                        <ion-col>
                                                            <ion-label class="divCard">` + datos[0].velocidad + `</ion-label>
                                                        </ion-col>
                                                    </ion-row>
                                                    <hr class="hrCard">

                                                        <ion-row class="rowCard">
                                                            <ion-col size="4">
                                                                <ion-label class="divCard">Acc</ion-label>
                                                            </ion-col>
                                                            <ion-col>
                                                                <ion-label class="divCard"> ` + datos[0].conAcc + ` </ion-label>
                                                            </ion-col>
                                                        </ion-row>
                                                        <hr class="hrCard">

                                                            <ion-row class="rowCard">
                                                                <ion-col size="4">
                                                                    <ion-label class="divCard">Batería</ion-label>
                                                                </ion-col>
                                                                <ion-col>
                                                                    <ion-label class="divCard"> ` + datos[0].conBat + ` </ion-label>
                                                                </ion-col>
                                                            </ion-row>
                                                            <hr class="hrCard">

                                                                <ion-row class="rowCard">
                                                                    <ion-col size="4">
                                                                        <ion-label class="divCard">Tapa Comb</ion-label>
                                                                    </ion-col>
                                                                    <ion-col>
                                                                        <ion-label style="padding-right: 10px;" class="divCard">  ` + datos[0].conComb + ` </ion-label>
                                                                        <ion-icon size="medium" color="danger" name="alert-circle">
                                                                        </ion-icon>
                                                                    </ion-col>
                                                                </ion-row>
                                                                <hr class="hrCard">

                                                                    <ion-row class="rowCard">
                                                                        <ion-col size="4">
                                                                            <ion-label class="divCard">Imei</ion-label>
                                                                        </ion-col>
                                                                        <ion-col>
                                                                            <ion-label class="divCard"> ` + _imei + ` </ion-label>
                                                                        </ion-col>
                                                                    </ion-row>
                                                                    <hr class="hrCard">

                                                                        <ion-row class="ion-justify-content-center">
                                                                            <ion-button size="small" fill="outline" id="pos-inicio&` + datos[0].latitud + ',' + datos[0].longitud + `" onclick ="localizarReporte(this.id);">
                                                                                <ion-icon slot="start" name="location"></ion-icon> Posición
                </ion-button>
                                                                        </ion-row>

        </ion-grid>
    </ion-card>
</ion-col>
`
    return (tarjetaReporteInicio);
}

// let tarjetaReporteTermino =
//     `
// <ion-card style="background-color: rgb(255, 202, 103);">
//         <ion-card-header>
//             <ion-card-title>Fin trayecto</ion-card-title>
//         </ion-card-header>
//         <ion-card-content>

//             <ion-toolbar class="toolBarCard">
//                 <h2>16/02/1981, 18:00</h2>
//                 <ion-buttons slot="start">
//                     <ion-button>
//                         <ion-icon name="calendar"></ion-icon>
//                     </ion-button>
//                 </ion-buttons>
//             </ion-toolbar>
//             <ion-toolbar class="toolBarCard">
//                 <ion-buttons slot="start">
//                     <ion-button>
//                         <ion-icon slot="icon-only" name="person"></ion-icon>
//                     </ion-button>
//                 </ion-buttons>
//                 <h2>Ingreso: Renato Martínez A.</h2>
//             </ion-toolbar>
//             <ion-toolbar class="toolBarCard">
//                 <ion-buttons slot="start">
//                     <ion-button>
//                         <ion-icon name="location"></ion-icon>
//                     </ion-button>
//                 </ion-buttons>
//                 <h2>Lat: -654.454654, Lon: -788.987456</h2>
//             </ion-toolbar>
//         </ion-card-content>
//     </ion-card>
// `
// let tarjetaReporteEventos =
//     `
// < ion-card style = "background-color: rgb(255, 202, 103);" >
// <ion-card-header>
//     <ion-card-title> Eventos</ion-card-title>
// </ion-card-header>
// <ion-card-content>

//     <ion-card class="cardReport">
//         <h2>16/02/1981, 18:00 </h2>
//         <h2>Salida operario: Renato Martínez </h2>
//     </ion-card>
//     <ion-card class="cardReportGreen">
//         <h2>16/02/1981, 18:00 </h2>
//         <h2>Tapa combustible CERRADA</h2>
//     </ion-card>
//     <ion-card class="cardReportRed">
//         <h2>16/02/1981, 18:00 </h2>
//         <h2>Tapa combustible ABIERTA</h2>
//     </ion-card>
// </ion-card-content>
// </ion-card >
// `

