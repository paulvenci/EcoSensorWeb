
let myVar;
let dispositivos = [];
let timerIniciado;
let tarjetaCreada;
tarjetaCreada = false;
async function openMenu() {
  await menuController.open();
}

//*! Conectar Socket Web
//socketContectar('45.236.131.228', '4501');
socketContectar('localhost', '4500');

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


