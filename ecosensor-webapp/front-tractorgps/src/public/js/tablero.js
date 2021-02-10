function cargaTablero() {
    // console.log('tab');
    $('#tablero').load('html/tablero.html');
    cargaTableroCard();

}

function actualizaTablero() {
    for (var i = 0; i < dispositivos.length; i++) {
        var ultConexion = document.querySelector("#ultConexion-" + String(i));
        var operadorNombre = document.querySelector("#operadorNombre-" + String(i));
        var velocidad = document.querySelector("#velocidad-" + String(i));
        var conAcc = document.querySelector("#conAcc-" + String(i));
        var conBat = document.querySelector("#conBat-" + String(i));
        var conTap = document.querySelector("#conTap-" + String(i));
        var imei = document.querySelector("#imei-" + String(i));


        ultConexion.textContent = 'Últ. conexión: ' + moment(dispositivos[i].fecha).add(3, 'h').format('DD-MM-YYYY, HH:mm');
        operadorNombre.textContent = dispositivos[i].operadorNombre;
        velocidad.textContent = dispositivos[i].velocidad;
        conAcc.textContent = dispositivos[i].conAcc;
        conBat.textContent = dispositivos[i].conBat;
        conTap.textContent = dispositivos[i].conComb;
        imei.textContent = dispositivos[i].imei;
        // console.log(dispositivos[i].fecha)
    }
}

function cargaTableroCard() {
    // console.log('card');

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
                <ion-button fill="clear" expand="full" id="tipoMarcaModelo-` + String(i) + `>
                    <ion-icon slot="start" name="car" size="large"></ion-icon>
                    ` + dispositivos[i].vehiculo_tipo + ' ' + dispositivos[i].vehiculo_marca + ' ' + dispositivos[i].vehiculo_modelo + `
                </ion-button>
                <ion-card-subtitle class="ion-text-center" id="ultConexion-`+ String(i) + `"> Últ. conexión: ` + dispositivos[i].fecha + ` </ion-card-subtitle>
            </ion-card-header>
            <ion-grid>
                <ion-row class="rowCard">
                    <ion-col size="4">
                        <ion-label class="divCard">Patente</ion-label>
                    </ion-col>
                    <ion-col>
                        <ion-label class="divCard" id="patente- ` + String(i) + `">` + dispositivos[i].vehiculo_patente.toUpperCase() + `</ion-label>
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
                        <ion-label style="padding-right: 10px;" class="divCard" id="conTap-`+ String(i) + `">` + dispositivos[i].conComb + `</ion-label>
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

                    <ion-button size="small" fill="outline" onclick="localizar(this.id);" id="`+ i + `">
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

        // console.log('Función dispositivoListar:');
        // console.log(dispositivos);
        tarjetaCreada = true;
    }

}
function localizar(_id) {
    //var idDis = _id.split('-', 2)
    // console.log(_id);

    //alert('Localizar ' + dispositivos[idDis[1]].latitud + ', ' + dispositivos[idDis[1]].longitud);
    createModalMapa(_id);

}
async function createModalMapa(_id) {
    const modal = await modalController.create({
        component: 'modal-content-mapa'
    });

    await modal.present();
    currentModal = modal;

    iniciaMapaModal(dispositivos[_id].latitud, dispositivos[_id].longitud, 'GM1');
    // console.log(dispositivos[_id].latitud, dispositivos[_id].longitud);

    iniciaMarcaModalTablero(_id);
}
function iniciaMarcaModalTablero(_i) {
    var lati = parseFloat(dispositivos[_i].latitud);
    var long = parseFloat(dispositivos[_i].longitud);
    // console.log(lati);
    // console.log(long);
    var markerModal;
    markerModal = L.marker([lati, long], { icon: greenIcon })
        .addTo(myMapModal)
        .bindPopup(
            '<strong>Operario</strong>: ' + dispositivos[_i].operadorNombre + `<br>
                 <strong>Velocidad</strong>: ` + dispositivos[_i].velocidad + ` km/h<br>
                 <strong>Conexión Bateria</strong>: ` + dispositivos[_i].conBat + `<br>
                 <strong>Contacto</strong>: ` + dispositivos[_i].conAcc + `<br>
                 <strong>Tapa Comb</strong>: ` + dispositivos[_i].conComb + `<br>
                 <strong>Últ. conexión</strong>: ` + dispositivos[_i].fecha)
    //myMap.on('click', function () { })
}



//* SOCKET EMIT
function cargaDispoEmit(_nombreUsuario) {
    socket.emit('dispositivoListar', {
        nombre_usuario: _nombreUsuario
    });
}


