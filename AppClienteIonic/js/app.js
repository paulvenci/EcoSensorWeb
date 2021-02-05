
let timeTablero;
let timeMapa;
let dispositivos = [];
let timerIniciado;
let tarjetaCreada;
let myMap;
let mapaIniciado = false;
let marker = [];
tarjetaCreada = false;

// Variables para reporte
let vehiculo;
let operario;

async function openMenu() {
  await menuController.open();
}

//*! Conectar Socket Web
//socketContectar('104.248.27.211', '4500');
// socketContectar('localhost', '4500');

socketON();
//*! Socket Web

function cargaSocketEmit() {
  socket.emit('obtieneDatosUsuario',
    {
      username: 'paulvenci',
      pass: 'uvas8827'
    })
}


customElements.define('modal-content1', class ModalContent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <ion-content fullscreen>
      <ion-card>
        <ion-card-header>
          INIICIO DE SESION
        </ion-card-header>
          <ion-toolbar>
            <ion-title>INICIO DE SESIÓN</ion-title>
            <ion-buttons slot="end">
            <ion-button onclick="dismissModal()">CERRAR</ion-button>
            </ion-buttons>
          </ion-toolbar>
        <ion-card-content>
       
      <ion-item>
        <ion-label position="floating">Nombre de usuario</ion-label>
        <ion-input id="userName"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Contraseña</ion-label>
        <ion-input id="pass"></ion-input>
      </ion-item>


        </ion-card-content>
      </ion-card>
    </ion-content>`;
  }
});
let currentModal = null;
// const button = document.querySelector('ion-button');
// button.addEventListener('click', createModal);

async function createModal() {
  const modal = await modalController.create({
    component: 'modal-content1'
  });

  await modal.present();
  currentModal = modal;
}

function dismissModal() {
  if (currentModal) {
    currentModal.dismiss().then(() => { currentModal = null; });
  }
}


async function iniciaCargando() {
  const loading = await loadingController.create({
    spinner: 'dots',
    message: 'Por favor espere, cargando ...',
    duration: 6000,
    translucent: true

  });

  await loading.present();
}
let myMapModal;

function iniciaMapaModal(_lat, _lon, tipoMapa) {
  lati = parseFloat(_lat);
  long = parseFloat(_lon);
  mapaIniciado = true;
  myMapModal = L.map('map-Modal').setView([lati, long], 18);
  switch (tipoMapa) {
    case 'GM1':
      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(myMapModal);
      break;

    case 'GM2':
      L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(myMapModal);
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
      }).addTo(myMapModal);
      break;

    case 'OS1':
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'pma'
      }).addTo(myMapModal);
      break;
  }
}
var greenIcon = L.icon({
  iconUrl: 'images/tractor-verde.png',
  iconSize: [34, 48], // size of the icon
  iconAnchor: [17, 24], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -24] // point from which the popup should open relative to the iconAnchor
});

customElements.define('modal-content-mapa', class ModalContent extends HTMLElement {
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