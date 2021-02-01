function dispositivoListar(datos) {
    console.log(datos.objeto[0].id);

    for (var i = 0; i < datos.objeto.length; i++) {
        console.log(datos.objeto[i].estado);

        var tr = `
                <tr>
                <td>` + datos.objeto[i].estado + `</td>
                <td>` + datos.objeto[i].nombre + `</td>
                <td>` + datos.objeto[i].marca + `</td>
                <td>` + datos.objeto[i].modelo + `</td>
                <td>` + datos.objeto[i].imei + `</td>
                <tr/>`;
        $('#tablaDispositivos').append(tr);
    }

}