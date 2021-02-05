
function cargaMapa() {
    $('#mapa').load('html/mapa.html');
}

function cargaMapaON() {
    socket.on('estadoDispositivo', (data) => {
        // console.log('estadoDispositivo => On');
        dispositivoListar(data);
        recargaMapa();
    });
}

function recargaMapa() {
    // Iniciar mapa
    // Si el mapa está iniciado, recaragar las marcas
    // Si no, cargar todas las marcas de los dispositivos
    console.log('Mapa iniciado: ' + mapaIniciado);

    if (mapaIniciado) {
        console.log('Recarga Mapa');
        // Recarga marca con nuevas posiciones
        recargaMarca()
    } else {
        console.log('Inicia Mapa');

        // Inicia Mapa
        // GM1 => GoogleMaps camino
        // GM2 => GoogleMaps satelital
        // GM3 => GoogleMaps hibrido
        // MP1 => Mapbox camino
        // OS1 => OpenStreet 
        iniciaMapa(dispositivos[0].latitud, dispositivos[0].longitud, 'GM1')
        iniciaMarca()
    }
}

function iniciaMarca() {
    for (var i = 0; i < dispositivos.length; i++) {
        var lati = parseFloat(dispositivos[i].latitud);
        var long = parseFloat(dispositivos[i].longitud);
        marker[i] = L.marker([lati, long], { icon: greenIcon })
            .addTo(myMap)
            .bindPopup(
                '<strong>Operario</strong>: ' + dispositivos[i].operadorNombre + `<br>
                 <strong>Velocidad</strong>: ` + dispositivos[i].velocidad + ` km/h<br>
                 <strong>Conexión Bateria</strong>: ` + dispositivos[i].conBat + `<br>
                 <strong>Contacto</strong>: ` + dispositivos[i].conAcc + `<br>
                 <strong>Tapa Comb</strong>: ` + dispositivos[i].conComb + `<br>
                 <strong>Últ. conexión</strong>: ` + dispositivos[i].fecha)
        //myMap.on('click', function () { })
    }
}

function recargaMarca() {
    for (var i = 0; i < dispositivos.length; i++) {
        var lati = parseFloat(dispositivos[i].latitud);
        var long = parseFloat(dispositivos[i].longitud);
        var _latLng = L.latLng(lati, long)
        //   console.log(_latLng);
        marker[i].setLatLng(_latLng);
        marker[i].bindPopup(
            `<strong>Operario</strong>: ` + dispositivos[i].operadorNombre + `<br>
             <strong>Velocidad</strong>: ` + dispositivos[i].velocidad + ` km/h<br>
             <strong>Conexión Bateria</strong>: ` + dispositivos[i].conBat + `<br>
             <strong>Contacto</strong>: ` + dispositivos[i].conAcc + `<br>
             <strong>Tapa Comb: </strong>` + dispositivos[i].conComb + `<br>
             <strong>Últ. conexión</strong>: ` + dispositivos[i].fecha)
    }
}

function iniciaMapa(_lat, _lon, tipoMapa) {
    lati = parseFloat(_lat);
    long = parseFloat(_lon);
    mapaIniciado = true;

    myMap = L.map('map-template').setView([lati, long], 16);
    switch (tipoMapa) {
        case 'GM1':
            L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            }).addTo(myMap);
            break;

        case 'GM2':
            L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(myMap);
            break;

        case 'GM3':

            break;
        case 'GM4':
            var map = new google.maps.Map(document.getElementById("map-template"), {
                center: new google.maps.LatLng(lati, long),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            break;

        case 'MB1':
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'EcoSensor',
                maxZoom: 20,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'pk.eyJ1IjoicGF1bHZlbmNpIiwiYSI6ImNrY20zczE4azA2cDgycm1vNzBrMzJuNzQifQ.TOmlx6MOB7Gv9d96qQCx6A'
            }).addTo(mymap);
            break;

        case 'OS1':
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'pma'
            }).addTo(myMap);
            break;
    }
}


function finalizaMapa() {
    myMap.remove();
}