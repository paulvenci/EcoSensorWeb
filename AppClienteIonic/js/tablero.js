function cargaTablero() {
    $('#tablero').load('html/tablero.html');
    cargaTableroCard();
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
    <ion-card size-md="8" offset-md="2" style="background-color:#4DC92A;" id="tarjetas">
        <ion-card-header>
        <ion-card-title id="nombreVehiculo" style="color: white">
                Tractor Ford 350
                </ion-card-title>
            <ion-card-subtitle style="color: white">
                Patente: PC1324
            </ion-card-subtitle>
            <ion-card-subtitle style="color: white">
            Última conexión: `+ dispositivos[i].fecha + `
        </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
        <ion-item>
                <ion-icon name="key" slot="start" size="large"></ion-icon>
                <ion-label>` + dispositivos[i].conAcc + `</ion-label>
            </ion-item>
            <ion-item>
                <ion-icon name="person" slot="start" size="large"></ion-icon>
                <ion-label>` + dispositivos[i].operadorNombre + `</ion-label>
            </ion-item>
            <ion-item>
            <img class="icono" slot="start" src="images/iconos/iconfinder_battery_5925588.svg" alt="">
                <ion-label>` + dispositivos[i].conBat + `</ion-label>
            </ion-item>
            
            <ion-item>
                <ion-icon name="color-fill" slot="start" size="large"></ion-icon>
                <ion-label>Tapa: ` + dispositivos[i].conComb + `</ion-label>
            </ion-item>
            
            <ion-item>
            <ion-icon name="speedometer" slot="start" size="large"></ion-icon>
            <ion-label>Velocidad: ` + dispositivos[i].velocidad + ` km/h</ion-label>
            </ion-item>

            <ion-item>
                <ion-label>Estado del Relé: ` + dispositivos[i].control1 + `</ion-label>
                ` + strControl + `
                </ion-item>
                
                </ion-card-content>
                </ion-card>
                `
        $('#tarjetas').remove();
        $('#tarjetas').remove();

        $('#cards').append(cardIon);
        $('#cards').append(cardIon);


        console.log('Función dispositivoListar:');
        console.log(dispositivos);
    }
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
        cargaTableroCard();
    });
}
