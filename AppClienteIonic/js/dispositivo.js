

//* SOCKET EMIT
function estadoDispositivo(_userName) {
    console.log('estadoDispositivo => Emit');
    socket.emit('estadoDispositivo', {
        userName: _userName
    })
}

//* FUNCION LISTAR DISPOSITIVOS
function dispositivoListar(datos) {
    console.log('DispositivoListar');
    console.log(datos.dispositivos[0].operadorNombre);

    dispositivos.length = 0;

    for (var i = 0; i < datos.dispositivos.length; i++) {
        var datosDispo;
        //* Conexión a ACC (encendido de máquina)
        if (datos.dispositivos[i].conAcc == '0') { strConAcc = 'Apagado' } else { strConAcc = 'Encendido' };

        //* Conexión a Bateria 12V
        if (datos.dispositivos[i].conBat == '1') { strConBat = 'Conectada' } else { strConBat = 'Desconectada!' };

        //* Nombre Operador
        if (datos.dispositivos[i].operadorNombre == null) { strOperadorNombre = 'Sin Operario a bordo' } else { strOperadorNombre = datos.dispositivos[i].operadorNombre };

        //* Rut Operador
        if (datos.dispositivos[i].operadorRut == null) { strOperadorRut = 'Sin Operario a bordo' } else { strOperadorRut = datos.dispositivos[i].operadorRut };

        //* Estado del rele
        if (datos.dispositivos[i].control1 == '1') {
            strTextControl = 'Activo';
        } else {
            strTextControl = 'Inactivo';
        };

        //* Tapa combustible
        switch (datos.dispositivos[i].conComb) {
            case '2':
                strTapaComb = 'Cerrada';
                break;
            case '3':
                strTapaComb = 'Abierta';
                break;
            case '1':
                strTapaComb = 'Intervenida';
                break;
        }

        //* Velocidad
        if (parseInt(datos.dispositivos[i].velocidad) < 2) {
            strVel = '0';
        } else {
            strVel = parseInt(datos.dispositivos[i].velocidad);
        }

        //* Latitud, Longitud
        if (datos.dispositivos[i].latitud != null && datos.dispositivos[i].longitud != null) {
            strLat = datos.dispositivos[i].latitud;
            strLon = datos.dispositivos[i].longitud;
        } else {
            strLat = 'Sin datos GPS';
            strLon = 'Sin datos GPS';
        }

        datosDispo = {
            nombreUsuario: datos.dispositivos[i].nombreUsuario,
            imei: datos.dispositivos[i].imei,
            latitud: strLat,
            longitud: strLon,
            velocidad: strVel,
            conAcc: strConAcc,
            conBat: strConBat,
            conComb: strTapaComb,
            operadorNombre: strOperadorNombre,
            operadorRut: strOperadorRut,
            fecha: moment(datos.dispositivos[i].fecha).format('DD-MM-YYYY, HH:mm:ss'),
            control1: strTextControl
        }
        dispositivos.push(datosDispo);
        console.log(datosDispo);
    }
}
