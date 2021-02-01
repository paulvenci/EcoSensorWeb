
function openFirst() {
  menuController.enable(true, 'first');
  menuController.open('first');
}

//*! Socket Web
const socket = io('45.236.131.228:4501')
socket.emit('mensaje', {
  mensaje: 'Mensaje desde el cliente'
})

function cargaSocketEmit() {
  socket.emit('obtieneDatosUsuario',
    {
      username: 'paulvenci',
      pass: 'uvas8827'
    })
}
socket.on('dispositivoListar', function (data) {
  dispositivoListar(data);
})
//*! Socket Web

customElements.define('modal-content', class ModalContent extends HTMLElement {
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
    component: 'modal-content'
  });

  await modal.present();
  currentModal = modal;
}

function dismissModal() {
  if (currentModal) {
    currentModal.dismiss().then(() => { currentModal = null; });
  }
}

function cargaTablero() {
  $('#tablero').load('/html/tablero.html');
  //cargaListaDispositivos();

}

function cargaListaDispositivos() {
  alert("Lista dispositivos");
}