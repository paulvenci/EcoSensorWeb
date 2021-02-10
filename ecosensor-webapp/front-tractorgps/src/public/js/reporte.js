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

function reporteVehiculo(data) {


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
    myMapRep = L.map("map-templateRep").setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'pma'
    }).addTo(myMapRep);
    let recorrido = [];
    let sumaVelocidad = 0;
    let velocidad = [];
    let distancia = 0;
    let contSumVel = 0;
    data.val.fullDataRep.forEach((element, i, array) => {
        vel = parseInt(element.velocidad);
        //console.log('Velocidad= ' + String(vel));

        if (element.latitud !== null && element.longitud !== null && vel >= 1) {
            var latlng1 = L.latLng(element.latitud, element.longitud);
            var latlng2 = L.latLng(array[i + 1].latitud, array[i + 1].longitud);
            //console.log('Distancia instantanea = ' + String(myMapRep.distance(latlng1, latlng2)));

            if (myMapRep.distance(latlng1, latlng2) !== NaN) {
                recorrido.push([element.latitud, element.longitud]);
                // duracion.push(1000);
                velocidad.push(element.velocidad);
                sumaVelocidad = sumaVelocidad + parseInt(element.velocidad);
                contSumVel += 1;
                if (parseInt(myMapRep.distance(latlng1, latlng2)) > 5) {
                    distancia += parseInt(myMapRep.distance(latlng1, latlng2));
                    //console.log('Distancia acumulada = ' + String(distancia));
                }
            }
        }
    })
    var velProm = 0;
    var velMax = 0;
    if (contSumVel > 0) {
        velProm = (sumaVelocidad / contSumVel).toFixed(1);
        velMax = Math.max(...velocidad);
    }

    var resultadoRepOpe = {
        totalHoras: (data.val.totalHoras).toFixed(1),
        totalDistancia: distancia,
        velocidadMaxima: velMax,
        velocidadPromedio: velProm
    }
    // Inicio
    iniReporte = document.querySelector('#iniRep');
    let strIniciaRep = tarjetaReporteOperario(resultadoRepOpe);
    let eleIniRep = document.createElement("div");
    eleIniRep.innerHTML = strIniciaRep;
    iniReporte.appendChild(eleIniRep);
    myMapRep.remove();
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
    operarioSel = document.getElementById('selectOperario');
    $('#selectOperario').empty();
    operarioSel.disabled = true;
    operarioObj.compareWith = compareWithFnO;
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

function tarjetaReporteOperario(datos) {
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
                    <ion-label class="divCard">` + String(datos.totalDistancia) + ` m  [` + String((datos.totalDistancia / 1000).toFixed(1)) + ` km] </ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Tiempo activo</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">`+ String(datos.totalHoras) + ` hrs</ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Vel. máx</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">` + String(datos.velocidadMaxima) + ` km/h</ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="rowCard">
                <ion-col size="4">
                    <ion-label class="divCard">Vel. prom</ion-label>
                </ion-col>
                <ion-col>
                    <ion-label class="divCard">` + String(datos.velocidadPromedio) + ` km/h</ion-label>
                </ion-col>
            </ion-row>
            <hr class="hrCard">

            <ion-row class="ion-justify-content-center">
                <ion-button size="small" fill="outline" id="pos-inicio&` + datos.latitud + ',' + datos.longitud + `"
                    onclick="localizarReporte(this.id);">
                    <ion-icon slot="start" name="location"></ion-icon> Recorrido
                </ion-button>
            </ion-row>

        </ion-grid>
    </ion-card>
</ion-col>
    `
    return (tarjRepOpe);
}


