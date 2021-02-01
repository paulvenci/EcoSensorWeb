const socket = io();

// Elementos DOM
let dispositivo_id = document.getElementById('dispId');
let tempAire = document.getElementById('tempAire');
let humAire = document.getElementById('humAire');
let indiceUV = document.getElementById('indiceUV');
let lluviaSiNo = document.getElementById('lluviaSiNo');
let humSuelo = document.getElementById('humSuelo');
let coord = document.getElementById('coord');
let altura = document.getElementById('altura');
let velocidad = document.getElementById('velocidad');
let fecha = document.getElementById('fecha');
let hora = document.getElementById('hora');
let chkSeguir = document.getElementById('btnMenuUp');
let icoBat = document.getElementById('iconBat');
let myMap, marker2;
let marker = [];
let markerEx = [];
let marcasEntradasSalidas = [];
let fechaInicio = document.getElementById("fechaInicio");
let fechaFin = document.getElementById("fechaFin");
let operarioRut = document.getElementById("rut");
let nombreOperario = document.getElementById("nombreOperario");
let coordenadas = document.getElementById("coordenadas");
let conBat = document.getElementById("conBat");
let conAcc = document.getElementById("conAcc");
let ultimaConexion = document.getElementById("ultimaConexion");
let chkMostrarRecorrido = document.getElementById("chkMostrarRecorrido");
let optControlAct = document.getElementById("controlAct");
let optControlDes = document.getElementById("controlDes");
let imei;

let conBatStr, conAccStr, velocidadActual, operadorActual, rutActual, latActual, lonActual;
let st_line;


// *** Inicia Mapa ***
function recarga() {
    console.log('Socket.EMIT => ubicacion');
    socket.emit('ubicacion', {
        userName: "paulvenci", //_nombreUsuario,
        password: "uvas" //_password
    })
    //  console.log('Iniciado');

}

socket.on('ubicacion', function (data) {
    console.log('Socket.ON => ubicacion');

    if (iniciado == 0) {

        iniciaMapa(data.dispositivos[0].latitud, data.dispositivos[0].longitud);

        for (var i = 0; i < data.dispositivos.length; i++) {
            imei = data.dispositivos[i].imei;
            operadorActual = data.dispositivos[i].operadorNombre;
            rutActual = data.dispositivos[i].operadorRut;
            latActual = data.dispositivos[i].latitud;
            lonActual = data.dispositivos[i].longitud;
            velocidadActual = data.dispositivos[i].velocidad;
            ultimaConexionActual = data.dispositivos[i].fecha;
            if (data.dispositivos[i].conBat == '1') {
                conBatStr = "Batería conectada";
            } else {
                conBatStr = "Batería desconectada";
            };
            if (data.dispositivos[i].conAcc == '1') {
                conAccStr = "Contacto encendido"
            } else {
                conAccStr = "Contacto apagado"
            }

            marker[i] = L.marker([data.dispositivos[i].latitud, data.dispositivos[i].longitud])
                .addTo(myMap)
                .bindPopup('<strong>Operario</strong>: ' + data.dispositivos[i].operadorNombre + `<br>
                <strong>Velocidad</strong>: ` + data.dispositivos[i].velocidad + ` km/h<br>
                <strong>Conexión Bateria</strong>: ` + conBatStr + `<br>
                <strong>Contacto</strong>: ` + conAccStr)
                .on('click', function () {
                    // nombreOperario.innerHTML = "Nombre operario: " + operadorActual;
                    // operarioRut.innerHTML = "Rut: " + rutActual;
                    // velocidad.innerHTML = "Velocidad: " + velocidadActual + " km/h";
                    // coordenadas.innerHTML = "Coordenadas: " + latActual + " , " + lonActual;
                    // conBat.innerHTML = "Conexión batería: " + conBatStr;
                    // conAcc.innerHTML = "Contacto: " + conAccStr;
                    // ultimaConexion.innerHTML = "Última conexión: " + moment(ultimaConexionActual).format("DD-MM-YYYY HH:mm");
                });
        }
        myMap.on('click', function () { })

    } else {
        recargaMarca(data);
    }
})

function finalizaMapa() {
    myMap.remove();
}

function iniciaMapa(_lat, _lon) {
    lati = parseFloat(_lat);
    long = parseFloat(_lon);
    myMap = L.map("map-template").setView([lati, long], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'pma'
    }).addTo(myMap);

    iniciado = 1;
    //  fechaInicio.value = "29-11-2020 19:00"
    //  fechaFin.value = "29-11-2020 20:00"
}

function recargaMarca(data) {
    for (var i = 0; i < data.dispositivos.length; i++) {
        let conBatStr, conAccStr;
        //  console.log('conAcc: ' + data.dispositivos[i].conAcc);
        //console.log('conBat: ' + data.dispositivos[i].conBat);

        if (data.dispositivos[i].conBat == '1') {
            conBatStr = "Batería conectada";
        } else {
            conBatStr = "Batería desconectada";
        };
        if (data.dispositivos[i].conAcc == '1') {
            conAccStr = "Contacto encendido"
        } else {
            conAccStr = "Contacto apagado"
        }

        var lati = parseFloat(data.dispositivos[i].latitud);
        var long = parseFloat(data.dispositivos[i].longitud);
        var _latLng = L.latLng(lati, long)
        //   console.log(_latLng);
        marker[i].setLatLng(_latLng);
        marker[i].bindPopup('<strong>Operario</strong>: ' + data.dispositivos[i].operadorNombre + `<br>
                            <strong>Velocidad</strong>: ` + data.dispositivos[i].velocidad + ` km/h<br>
                            <strong>Conexión Bateria</strong>: ` + conBatStr + `<br>
                            <strong>Contacto</strong>: ` + conAccStr);
    }
    //myMap.panTo([lati, long]);
}





socket.on('actualizaTractorGps', function (data) {
    console.log('Socket.ON => actializaTractorGps');
    console.log(data);

    if (iniciado == 0) {
        iniciaMapa(data.latitud, data.longitud, 1);
    } else {

    }
})

function actualizaControl() {
    var estadoControl;
    if (optControlAct.checked) {
        estadoControl = 1;
    } else {
        estadoControl = 0;
    }

    console.log('Socket.EMIT => actualizaControl');
    socket.emit('actualizaControl', {
        imei: imei,
        estado: estadoControl
    })

}

socket.on('actualiza', function (data) {
    console.log('Socket.ON => actualiza ');
    console.log(data);
    dispositivo_id.innerHTML = '<h4 id="dispId"><i class="	fas fa-microchip"></i> Sensores - ID: ' + data.dispositivo_id + '</h4>';
    tempAire.innerHTML = data.tempAire + " °C";
    humAire.innerHTML = data.humAire + " %";
    // cargaBat.innerHTML = data.bateria;
    indiceUV.innerHTML = data.uv;
    if (data.lluvia == "1") {
        lluviaSiNo.innerHTML = "NO";
    } else {
        lluviaSiNo.innerHTML = "SI";
    }
    if (parseInt(data.humSuelo) < 0) {
        humSuelo.innerHTML = "0% hr";
    } else {
        humSuelo.innerHTML = data.humSuelo + " % hr";
    }

    let cargaBatVolt = parseFloat(data.bateria);
    let porcBat = parseFloat(cargaBatVolt * 100 / 5);
    //{"g":"1,1,20201014134428.000,-33.735917,-70.758105,466.400,0.02,38.4,1,,1.1,1.6,1.2","t":"19.50","h":"50.00","ll":"1","uv":"1","b":"4.12","hs":"28"}

    if (document.getElementById('icoBater')) {
        console.log('existe');
        var myObj1 = document.getElementById('icoBater');
        padre = myObj1.parentNode;
        padre.removeChild(myObj1);
        myObj1.remove;
        var myObj2 = document.getElementById('textoVoltBat');
        padre = myObj2.parentNode;
        padre.removeChild(myObj2);
        myObj1.remove;
    } else {
        console.log('No existe');
    }
    switch (true) {
        case (porcBat <= 25):
            console.log('0% - 25%');
            icoBat.insertAdjacentHTML('afterend', "<i id='icoBater' class='fas fa-battery-quarter w3-xlarge'></i><div class='w3-container' id='textoVoltBat'>" + cargaBatVolt + "v</div>")
            icoCreado = 1;
            break;
        case (porcBat <= 50):
            console.log('26% -50%');
            icoBat.insertAdjacentHTML('afterend', "<i id='icoBater' class='fas fa-battery-half w3-xlarge'></i><div class='w3-container' id='textoVoltBat'>" + cargaBatVolt + "v</div>")
            icoCreado = 1;
            break;
        case (porcBat <= 75):
            console.log('51% - 75%');
            icoBat.insertAdjacentHTML('afterend', "<i id='icoBater' class='fas fa-battery-three-quarters w3-xlarge'></i><div class='w3-container' id='textoVoltBat'>" + cargaBatVolt + "v</div>")
            icoCreado = 1;
            break;
        case (porcBat <= 100):
            icoBat.insertAdjacentHTML('afterend', "<i id='icoBater' class='fas fa-battery-full w3-xlarge'></i><div class='w3-container' id='textoVoltBat'>" + cargaBatVolt + "v</div>")
            console.log('76% - 100%');
            icoCreado = 1;
            break;
    }

    coord.innerHTML = data.coordLong + ", " + data.coordLati + '  <a href="https://www.google.cl/maps/@' + data.coordLati + ',' + data.coordLong + ',19z" target="_blank"> <i class="fas fa-map-marked-alt " style="font-size:28px; color: red"></i></a>';
    altura.innerHTML = Math.round(parseFloat(data.altura)) + "m";
    if (parseFloat(data.velocidad) < 5) {
        velocidad.innerHTML = "0.00 km/h";
    } else {
        velocidad.innerHTML = data.velocidad + " km/h";
    }
    fecha.innerHTML = moment(data.fechaHora).format('DD-MM-YYYY');
    hora.innerHTML = moment(data.fechaHora).format('HH:mm');
    console.log(iniciado);

    if (iniciado == 0) {
        iniciaMapa(data.coordLati, data.coordLong, data.acc);
    } else {
        recargaMarca(data.coordLati, data.coordLong, data.acc);
    }
})



function reporte() {
    console.log('Pidiendo reporte');
    //alert(moment(fechaInicio.value).format("DD-MM-YYYY hh:mm:ss"));
    // console.log('Inicio: ' + fechaInicio);

    socket.emit('reporteOP', {
        fechaInicio: fechaInicio.value,//moment(fechaInicio.value).format("YYYY-MM-DD hh:mm:ss"), // "2020-11-29 19:10:00", //_nombreUsuario,
        fechaFin: fechaFin.value, //moment(fechaFin.value).format("YYYY-MM-DD hh:mm:ss"), // "2020-11-29 23:59:59",         //_password
        rut: "141920995"
    })
}




let recorrido = [];
let duracion = [];
let latlng1, latlng2;

socket.on('reporteOP', function (data) {
    console.log('Recibiendo reporte...');
    // console.log(data.val);
    if (recorrido.length !== 0) {
        limpiaReporte();
    }
    recorrido = [];
    duracion = [];

    var horasActivas;
    let distancia = 0;
    var entrada = new moment();
    var salida = new moment();
    var tiempoMin = 0;
    let velocidad = [];
    var sumaVelocidad = 0;
    for (var i = 0; i < data.val.length; i++) {

        if (i + 1 == data.val.length) { //Detectando final de los registros del reporte
            salida = moment(data.val[i].fecha);
            tiempoMin = tiempoMin + moment.duration(salida.diff(entrada)).as('hours');
            console.log('Salida: ' + moment(data.val[i].fecha).format("DD-MM-YYYY HH:mm:ss"));
        } else {
            //Verificando si 1er registro es entrada o salida
            switch (data.val[i].eventoRfid) {
                case "0": //Viene desde entrada
                    if (data.val[i].latitud.trim() !== "" && data.val[i].longitud.trim() !== "") {
                        latlng1 = L.latLng(data.val[i].latitud, data.val[i].longitud);
                        latlng2 = L.latLng(data.val[i + 1].latitud, data.val[i + 1].longitud);
                        console.log('Distancia instantanea = ' + String(myMap.distance(latlng1, latlng2)));

                        if (myMap.distance(latlng1, latlng2) !== NaN) {
                            recorrido.push([data.val[i].latitud, data.val[i].longitud]);
                            duracion.push(1000);
                            velocidad.push(data.val[i].velocidad);
                            sumaVelocidad = sumaVelocidad + parseInt(data.val[i].velocidad);
                            if (parseInt(myMap.distance(latlng1, latlng2)) > 5) {
                                distancia = distancia + parseInt(myMap.distance(latlng1, latlng2));
                                console.log('Distancia acumulada = ' + String(distancia));
                            }
                        }
                    }
                    if (i == 0) {
                        entrada = moment(data.val[i].fecha);
                        console.log('Entrada: ' + moment(data.val[i].fecha).format("DD-MM-YYYY HH:mm:ss"));
                    }
                    break;
                case "e": //Entrada
                    entrada = moment(data.val[i].fecha);
                    console.log('Entrada: ' + moment(data.val[i].fecha).format("DD-MM-YYYY HH:mm:ss"));
                    if (data.val[i].latitud.trim() !== "" && data.val[i].longitud.trim() !== "") {
                        latlng1 = L.latLng(data.val[i].latitud, data.val[i].longitud);
                        latlng2 = L.latLng(data.val[i + 1].latitud, data.val[i + 1].longitud);
                        console.log('Distancia acumulada = ' + String(distancia));
                        if (myMap.distance(latlng1, latlng2) !== NaN) {
                            recorrido.push([data.val[i].latitud, data.val[i].longitud]);
                            marcasEntradasSalidas[i] = L.marker(latlng1).addTo(myMap)
                            duracion.push(1000);
                            velocidad.push(data.val[i].velocidad);
                            sumaVelocidad = sumaVelocidad + parseInt(data.val[i].velocidad);
                            if (parseInt(myMap.distance(latlng1, latlng2)) > 5) {
                                distancia = distancia + parseInt(myMap.distance(latlng1, latlng2));
                                console.log('Distancia acumulada = ' + String(distancia));
                            }
                        }
                    }
                    break;
                case "s": //Salida
                    //No se considera este punto para acumulación de distancia
                    salida = moment(data.val[i].fecha);
                    tiempoMin = tiempoMin + moment.duration(salida.diff(entrada)).as('hours');
                    console.log('Salida: ' + moment(data.val[i].fecha).format("DD-MM-YYYY HH:mm:ss"));
            }
        }
    }
    console.log("Distancia: " + distancia);
    console.log("Tiempo: " + tiempoMin);
    console.log('Max. Velocidad: ' + Math.max(velocidad));

    document.getElementById("horasActivas").innerHTML = String(roundedToFixed(tiempoMin, 1)) + " hrs";
    document.getElementById("distanciaRecorrida").innerHTML = String(roundedToFixed(distancia / 1000, 1)) + " km";
    // document.getElementById("maxVelocidad").innerHTML = String(Math.max(velocidad)) + " km/h";
    // document.getElementById("promVelocidad").innerHTML = String(roundedToFixed(sumaVelocidad / data.val.length, 1)) + " km/h";
    // console.log('Distancia = ' + distancia);
    // console.log(recorrido);

    if (chkMostrarRecorrido.checked == true) {
        // var marker2 = L.Marker.movingMarker(recorrido, duracion, { autostart: true }).addTo(myMap);
        // L.polyline(recorrido, { color: 'red' }).addTo(myMap);
        st_line = L.polyline(recorrido, {
            color: 'red',
            weight: 3,
            opacity: 0.5,
            smoothFactor: 1
        }).addTo(myMap);
        // marker2.on('click', function () {

        //     if (marker2.isRunning()) {
        //         marker2.pause();
        //     } else {
        //         marker2.start();
        //     }
        // });

        // marker2.on('end', function () {
        //     marker2.bindPopup('<b>Fin recorrido !</b>', { closeOnClick: false })
        //         .openPopup();
        // });
    }
})
