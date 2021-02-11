function cargaReporte() {
    $('#reporte').load('html/reporte.html');
}

function muestraReporteEmit() {

    _fechaInicio = moment(document.querySelector('#fechaInicio').value).format('YYYY-MM-DD');
    _fechaTermino = moment(document.querySelector('#fechaTermino').value).format('YYYY-MM-DD');
    _horaInicio = moment(document.querySelector('#horaInicio').value).format('HH:mm');
    _horaTermino = moment(document.querySelector('#horaTermino').value).format('HH:mm');
    vehiculo = document.getElementById('selectVehiculo');
    operario = document.getElementById('selectOperario')
    rdgr = document.getElementById('radioGrupoRep');
    console.log(rdgr.value);
    $('#iniRep').empty();
    $('#eveRep').empty();
    $('#finRep').empty();
    $('#resumenRep').empty();

    _imei = vehiculo.value.imei;
    _fechaInicio = _fechaInicio + ' ' + _horaInicio;
    _fechaTermino = _fechaTermino + ' ' + _horaTermino;
    console.log(_fechaInicio, _fechaTermino);
    if (_fechaInicio >= _fechaTermino) {
        alert('La fecha y hora inicial debe ser anterior a la fecha y hora de término')
        return;
    }

    if (rdgr.value == 'vehiculo') {
        socket.emit('reporteVehiculo',
            {
                imei: _imei,
                fechaInicio: _fechaInicio,
                fechaTermino: _fechaTermino
            })
    } else {
        _uid = operario.value.uid
        console.log('UID: ' + _uid);
        socket.emit('reporteOP',
            {
                uid: _uid,
                fechaInicio: _fechaInicio,
                fechaTermino: _fechaTermino
            })
    }
}
let dataReporteVeh;
let resultadoRepOpe;
function reporteVehiculo(data) {
    dataReporteVeh = data;
    console.log(data);

    // Resumen
    resReporte = document.querySelector('#resumenRep');
    let strResRep = resRepVeh(data[3]);
    let eleResRep = document.createElement("div");
    eleResRep.innerHTML = strResRep;
    resReporte.appendChild(eleResRep);

    // Inicio
    iniReporte = document.querySelector('#iniRep');
    let strIniciaRep = inicioRep(data[0]);
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
    let strTerminoRep = terminoRep(data[2]);
    let eleFinRep = document.createElement("div");
    eleFinRep.innerHTML = strTerminoRep;
    finReporte.appendChild(eleFinRep);

}

function reporteOperario(data) {
    console.log(data.val.totalHoras);
    resultadoRepOpe = data.val;
    // Inicio
    iniReporte = document.querySelector('#iniRep');
    let strIniciaRep = resRepOpe(resultadoRepOpe);
    let eleIniRep = document.createElement("div");
    eleIniRep.innerHTML = strIniciaRep;
    iniReporte.appendChild(eleIniRep);
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
    $('#selectOperario').empty();

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
    operarioSel = document.getElementById('selectOperario');
    $('#selectOperario').empty();
    operarioSel.disabled = true;
    operarioObj.compareWith = compareWithFnO;
    // console.log(operarioObj.length);

    operarioObj.forEach((option, i) => {
        let selectOptionOpe = document.createElement('ion-select-option');
        selectOptionOpe.value = option;
        selectOptionOpe.textContent = option.nombre;
        operarioSel.appendChild(selectOptionOpe);
    });

    operarioSel.value = operarioObj[0];
}

function eventoRep(datos) {
    let ini = `
            <ion-card id="eventoTarjetaRep"style="background-color: rgb(255, 202, 103);">
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
    //   console.log('lat: ' + lat);
    //   console.log('lon: ' + lon);
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
    iniciaMarcaModalReporte(_lat, _lon);
}
async function createModalMapaReporteRecorrido(_lat, _lon, recorridoArr) {
    const modal = await modalController.create({
        component: 'modal-content-mapa'
    });

    await modal.present();
    currentModal = modal;
    iniciaMapaModal(_lat, _lon, 'GM1', true, recorridoArr);
    // iniciaMarcaModalReporte(_lat, _lon);
}
function iniciaMarcaModalReporte(_lat, _lon) {
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
            <ion-col id="terminoRepTarj" class="ion-no-padding" size = "12" size-lg="3" size-sm="6" >
                <ion-card style="background-color: rgb(236, 236, 236);">
                    <ion-card-header>
                        <ion-button fill="clear" expand="full">
                            <ion-icon slot=" start" name="car" size="large">
                            </ion-icon> Termino de trayecto</ion-button>
                        <ion-card-subtitle class="ion-text-center">` + _fechaTermino + ` </ion-card-subtitle>
                    </ion-card-header>
                    <ion-grid>
                        <ion-row class="rowCard">
                            <ion-col size="4">
                                <ion-label class="divCard">Operario</ion-label>
                            </ion-col>
                            <ion-col>
                                <ion-label class="divCard"> ` + datos.operadorNombre + `</ion-label>
                            </ion-col>
                        </ion-row>
                        <hr class="hrCard">

                            <ion-row class="rowCard">
                                <ion-col size="4">
                                    <ion-label class="divCard">Velocidad</ion-label>
                                </ion-col>
                                <ion-col>
                                    <ion-label class="divCard">` + datos.velocidad + `</ion-label>
                                </ion-col>
                            </ion-row>
                            <hr class="hrCard">

                                <ion-row class="rowCard">
                                    <ion-col size="4">
                                        <ion-label class="divCard">Acc</ion-label>
                                    </ion-col>
                                    <ion-col>
                                        <ion-label class="divCard"> ` + datos.conAcc + ` </ion-label>
                                    </ion-col>
                                </ion-row>
                                <hr class="hrCard">

                                    <ion-row class="rowCard">
                                        <ion-col size="4">
                                            <ion-label class="divCard">Batería</ion-label>
                                        </ion-col>
                                        <ion-col>
                                            <ion-label class="divCard"> ` + datos.conBat + ` </ion-label>
                                        </ion-col>
                                    </ion-row>
                                    <hr class="hrCard">

                                        <ion-row class="rowCard">
                                            <ion-col size="4">
                                                <ion-label class="divCard">Tapa Comb</ion-label>
                                            </ion-col>
                                            <ion-col>
                                                <ion-label style="padding-right: 10px;" class="divCard">  ` + datos.conComb + ` </ion-label>
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
                                                    <ion-button size="small" fill="outline" id="pos-termino&` + datos.latitud + ',' + datos.longitud + `" onclick ="localizarReporte(this.id);">
                                                        <ion-icon slot="start" name="location"></ion-icon> Posición</ion-button>
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
    <ion-col id="inicioRepTarj" class="ion-no-padding" size="12" size-lg="3" size-sm="6">
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
                                                        <ion-label class="divCard"> ` + datos.operadorNombre + `</ion-label>
                                                    </ion-col>
                                                </ion-row>
                                                <hr class="hrCard">

                                                    <ion-row class="rowCard">
                                                        <ion-col size="4">
                                                            <ion-label class="divCard">Velocidad</ion-label>
                                                        </ion-col>
                                                        <ion-col>
                                                            <ion-label class="divCard">` + datos.velocidad + `</ion-label>
                                                        </ion-col>
                                                    </ion-row>
                                                    <hr class="hrCard">

                                                        <ion-row class="rowCard">
                                                            <ion-col size="4">
                                                                <ion-label class="divCard">Acc</ion-label>
                                                            </ion-col>
                                                            <ion-col>
                                                                <ion-label class="divCard"> ` + datos.conAcc + ` </ion-label>
                                                            </ion-col>
                                                        </ion-row>
                                                        <hr class="hrCard">

                                                            <ion-row class="rowCard">
                                                                <ion-col size="4">
                                                                    <ion-label class="divCard">Batería</ion-label>
                                                                </ion-col>
                                                                <ion-col>
                                                                    <ion-label class="divCard"> ` + datos.conBat + ` </ion-label>
                                                                </ion-col>
                                                            </ion-row>
                                                            <hr class="hrCard">

                                                                <ion-row class="rowCard">
                                                                    <ion-col size="4">
                                                                        <ion-label class="divCard">Tapa Comb</ion-label>
                                                                    </ion-col>
                                                                    <ion-col>
                                                                        <ion-label style="padding-right: 10px;" class="divCard">  ` + datos.conComb + ` </ion-label>
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
                                                                            <ion-button size="small" fill="outline" id="pos-inicio&` + datos.latitud + ',' + datos.longitud + `" onclick ="localizarReporte(this.id);">
                                                                                <ion-icon slot="start" name="location"></ion-icon> Posición
                </ion-button>
                                                                        </ion-row>

        </ion-grid>
    </ion-card>
</ion-col>
`
    return (tarjetaReporteInicio);
}

function resRepOpe(datos) {


    var tarjRepOpe =
        `
    <ion-col id="inicioRepTarj" class="ion-no-padding" size="12" size-lg="3" size-sm="6">
    <ion-card style="background-color: rgb(236, 236, 236);">
        <ion-card-header>
            <ion-button fill="clear" expand="full">
                <ion-icon slot=" start" name="car" size="large">
                </ion-icon> Reporte Operario
            </ion-button>
            <!-- <ion-card-subtitle class="ion-text-center">` + _fechaInicio + ` </ion-card-subtitle> -->
        </ion-card-header>

        <ion-grid>
            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Dist. recorrida</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">` + String(datos.distancia) + ` </ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">
              
            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Tiempo activo</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">`+ String(datos.totalHoras) + `</ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Vel. máx</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">` + String(datos.velMax) + `</ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Vel. prom</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">` + String(datos.velProm) + `</ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="ion-justify-content-center">
                <ion-button size="small" fill="outline" onclick="recorridoOpe();">
                    <ion-icon slot="start" name="location"></ion-icon> Recorrido
                </ion-button>
            </ion-row>

        </ion-grid>
    </ion-card>
</ion-col>
    `
    return (tarjRepOpe);
}

function resRepVeh(datos) {

    let tarResVeh =
        `
    <ion-col id="inicioRepTarj" class="ion-no-padding" size="12" size-lg="3" size-sm="6">
            <ion-card style="background-color: rgb(236, 236, 236);">
                <ion-card-header>
                    <ion-button fill="clear" expand="full">
                        <ion-icon slot=" start" name="car" size="large">
                        </ion-icon> Resumen
                    </ion-button>
                    <!-- <ion-card-subtitle class="ion-text-center">` + _fechaInicio + ` </ion-card-subtitle> -->
                </ion-card-header>
                <ion-grid>
                    <ion-row class="rowCard">
                        <ion-col size="6">
                            <ion-label class="divCard">Dist. recorrida</ion-label>
                        </ion-col>
                        <ion-col>
                            <ion-label class="divCard"> ` + datos.distancia + `</ion-label>
                        </ion-col>
                    </ion-row>
                    <hr class="hrCard">

                    <ion-row class="rowCard">
                        <ion-col size="6">
                            <ion-label class="divCard">Vel. máx</ion-label>
                        </ion-col>
                        <ion-col>
                            <ion-label class="divCard">` + datos.velocidadMaxima + `</ion-label>
                        </ion-col>
                    </ion-row>
                    <hr class="hrCard">

                    <ion-row class="rowCard">
                        <ion-col size="6">
                            <ion-label class="divCard">Vel. prom.</ion-label>
                        </ion-col>
                        <ion-col>
                            <ion-label class="divCard"> ` + datos.velocidadPromedio + ` </ion-label>
                        </ion-col>
                    </ion-row>
                    <hr class="hrCard">

                  <!--  <ion-row class="rowCard">
                        <ion-col size="6">
                            <ion-label class="divCard"> N° apertura tapa</ion-label>
                        </ion-col>
                        <ion-col>
                            <ion-label class="divCard"> ` + datos.contSumTapa + ` </ion-label>
                        </ion-col>
                    </ion-row>
                    <hr class="hrCard">

                    <ion-row class="rowCard">
                        <ion-col size="6">
                            <ion-label class="divCard">N° encendido acc</ion-label>
                        </ion-col>
                        <ion-col>
                            <ion-label style="padding-right: 10px;" class="divCard"> ` + datos.contSumAcc + ` </ion-label>
                            </ion-icon>
                        </ion-col>
                    </ion-row>
                    <hr class="hrCard">

                    <ion-row class="rowCard">
                        <ion-col size="6">
                            <ion-label class="divCard">Tiempo activo</ion-label>
                        </ion-col>
                        <ion-col>
                            <ion-label class="divCard"> ` + datos.tiempoActivo + ` </ion-label>
                        </ion-col>
                    </ion-row>
                    <hr class="hrCard"> -->

                    <ion-row class="ion-justify-content-center">
                        <ion-button size="small" fill="outline"
                            onclick="recorridoVeh();">
                            <ion-icon slot="start" name="location"></ion-icon> Recorrido
                        </ion-button>
                    </ion-row>

                </ion-grid>
            </ion-card>
        </ion-col>
    `
    return (tarResVeh);
}

function recorridoVeh() {
    createModalMapaReporteRecorrido(dataReporteVeh[4][0][0], dataReporteVeh[4][0][1], dataReporteVeh[4]);
}
function recorridoOpe() {
    console.log(resultadoRepOpe.recorrido[0]);
    console.log(resultadoRepOpe.recorrido[1]);

    createModalMapaReporteRecorrido(resultadoRepOpe.recorrido[0][0], resultadoRepOpe.recorrido[0][1], resultadoRepOpe.recorrido);
}