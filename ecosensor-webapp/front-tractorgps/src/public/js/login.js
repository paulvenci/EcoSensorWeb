function desplpiegaLogin() {
    // Agrega elemento adjacente con id = "tablero"
    const div = document.createElement("div");
    div.setAttribute("w3-include-html", "/html/login.html");
    div.setAttribute("class", "w3-container")
    div.setAttribute("id", "contenido1")
    contenidoBody.insertAdjacentElement("afterbegin", div)
    w3.includeHTML();
    iniciado = 0;
    clearInterval(myVar);
    w3.includeHTML();
    iniciado = 0;
}

function validarUsuario() {
    console.log('Validando usuario');
    var nombreUsuario = document.getElementById('inputUsuarioNombreUsuario');
    var pass = document.getElementById('inputUsuarioPassword');
    usuario_nombreUsuario = nombreUsuario.value;
    socket.emit('login',
        {
            usuario: nombreUsuario.value,
            password: pass.value
        })
}

function resultValidarUsuario(data) {
    // console.log('Data: ' + data.errorEstado);

    if (!data.errorEstado) {
        cargaSocketOn();
        cargaContenido(data);
    } else {
        alert('Login incorrecto')
    }
}