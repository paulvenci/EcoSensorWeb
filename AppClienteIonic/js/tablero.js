function cargaTablero() {
    console.log('tab');
    $('#tablero').load('html/tablero.html');
    cargaTableroCard();
}

function actualizaTablero() {

}

function cargaTableroCard() {
    console.log('card');

    for (var i = 0; i < dispositivos.length; i++) {
        if (dispositivos[i].control1 == 'Activo') {
            strControl = '<ion-toggle slot="start" checked></ion-toggle>';
        } else {
            strControl = '<ion-toggle slot="start"></ion-toggle>';
        }
        var cardIon = `
        <ion-col class="ion-no-padding" size="12" size-lg="3" size-sm="6">
        <ion-card style="background-color: rgb(236, 236, 236);">
            <ion-card-header>
                <ion-button fill="clear" expand="full">
                    <ion-icon slot="start" name="car" size="large"></ion-icon>
                    Tractor - Ford 350
                </ion-button>
                <ion-card-subtitle id="ultConexion-`+ String(i) + `"> Últ. conexión: ` + dispositivos[i].fecha + ` </ion-card-subtitle>

            </ion-card-header>
            <ion-grid>
                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Patente</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label class="divCard">JCTY78</ion-label>
                    </ion-col>
                </ion-row>
                <hr class="hrCard">

                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Operario</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label class="divCard" id="operadorNombre-`+ String(i) + `">` + dispositivos[i].operadorNombre + `</ion-label>
                    </ion-col>
                </ion-row>
                <hr class="hrCard">

                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Velocidad</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label class="divCard" id="velocidad-`+ String(i) + `">` + dispositivos[i].velocidad + `</ion-label>
                    </ion-col>
                </ion-row>
                <hr class="hrCard">

                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Acc</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label class="divCard" id="conAcc-`+ String(i) + `">` + dispositivos[i].conAcc + `</ion-label>
                    </ion-col>
                </ion-row>
                <hr class="hrCard">

                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Batería</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label class="divCard" id="conBat-`+ String(i) + `">` + dispositivos[i].conBat + `</ion-label>
                    </ion-col>
                </ion-row>
                <hr class="hrCard">

                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Tapa Comb</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label style="padding-right: 10px;" class="divCard" id="conBat-`+ String(i) + `">` + dispositivos[i].conComb + `</ion-label>
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
                        <ion-label class="divCard" id="imei-`+ String(i) + `">` + dispositivos[i].imei + `</ion-label>
                    </ion-col>
                </ion-row>
                <hr class="hrCard">

                <ion-row class="ion-justify-content-center">

                    <ion-button size="small" fill="outline" onclick="localizar(this.id);" id="btnPos-`+ String(i) + `">
                        <ion-icon slot="start" name="location"></ion-icon> Posición
                    </ion-button>
                    <ion-button size="small" fill="outline">
                        <ion-icon slot="start" name="list"></ion-icon> Detalle Hoy
                    </ion-button>
                </ion-row>

            </ion-grid>
        </ion-card>
    </ion-col>            
                `
        // $('#cards').remove();

        $('#cards').append(cardIon);

        console.log('Función dispositivoListar:');
        console.log(dispositivos);
    }

}
function localizar(_id) {
    var idDis = _id.split('-', 2)
    //alert('Localizar ' + dispositivos[idDis[1]].latitud + ', ' + dispositivos[idDis[1]].longitud);
    createModal2(idDis[1]);

}

async function createModal2(_id) {
    const modal = await modalController.create({
        component: 'modal-content2'
    });

    await modal.present();
    currentModal = modal;
    iniciaMapaModal(dispositivos[_id].latitud, dispositivos[_id].longitud, 'GM1');
    iniciaMarcaModal(_id);
}

//* SOCKET EMIT
function cargaDispoEmit(_nombreUsuario) {
    socket.emit('dispositivoListar', {
        nombre_usuario: _nombreUsuario
    });
}
//* SOCKET ON
function cargaTableroON() {
    socket.on('estadoDispositivo', (data) => {
        console.log('estadoDispositivo => On');
        dispositivoListar(data);
        console.log(tarjetaCreada);

        if (tarjetaCreada) {
            actualizaTablero();
        } else {
            cargaTableroCard();
            tarjetaCreada = true;
        }
    });
}

customElements.define('modal-content2', class ModalContent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <ion-header translucent>
          <ion-toolbar>
            <ion-title>Modal Content</ion-title>
            <ion-buttons slot="end">
              <ion-button onclick="dismissModal()">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content style="padding = 30px;" id="map-Modal">
        </ion-content>

      `;
    }
});
let myMapTablero;
function iniciaMapaModal(_lat, _lon, tipoMapa) {
    lati = parseFloat(_lat);
    long = parseFloat(_lon);
    mapaIniciado = true;
    myMapTablero = L.map('map-Modal').setView([lati, long], 16);
    switch (tipoMapa) {
        case 'GM1':
            L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            }).addTo(myMapTablero);
            break;

        case 'GM2':
            L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(myMapTablero);
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
            }).addTo(myMapTablero);
            break;

        case 'OS1':
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'pma'
            }).addTo(myMapTablero);
            break;
    }
}
var greenIcon = L.icon({
    iconUrl: 'images/tractor-verde.png',
    iconSize: [34, 48], // size of the icon
    iconAnchor: [17, 24], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -24] // point from which the popup should open relative to the iconAnchor
});

function iniciaMarcaModal(_i) {

    var lati = parseFloat(dispositivos[_i].latitud);
    var long = parseFloat(dispositivos[_i].longitud);
    var markerModal;
    markerModal = L.marker([lati, long], { icon: greenIcon })
        .addTo(myMapTablero)
        .bindPopup(
            '<strong>Operario</strong>: ' + dispositivos[_i].operadorNombre + `<br>
                 <strong>Velocidad</strong>: ` + dispositivos[_i].velocidad + ` km/h<br>
                 <strong>Conexión Bateria</strong>: ` + dispositivos[_i].conBat + `<br>
                 <strong>Contacto</strong>: ` + dispositivos[_i].conAcc + `<br>
                 <strong>Tapa Comb</strong>: ` + dispositivos[_i].conComb + `<br>
                 <strong>Últ. conexión</strong>: ` + dispositivos[_i].fecha)


    //myMap.on('click', function () { })
}
