// Matematicas
function roundedToFixed(_float, _digits) {
    var rounder = Math.pow(10, _digits);
    return (Math.round(_float * rounder) / rounder).toFixed(_digits);
}

// Mapa
function limpiaReporte(_linea, _mapa) {
    _linea.remove(_mapa)
}

// Elimina elemento con 'id' dado
function eliminarElemento(id) {
    elemento = document.getElementById(id);
    if (!elemento) {
        //  alert("El elemento selecionado no existe");
    } else {
        padre = elemento.parentNode;
        padre.removeChild(elemento);
    }
}

// Resalta color del botón del menú
function resaltaBoton(_boton) {

    document.getElementById('btnTablero').setAttribute("class", "w3-bar-item w3-button w3-padding")
    document.getElementById('btnReporte').setAttribute("class", "w3-bar-item w3-button w3-padding")
    document.getElementById('btnMapa').setAttribute("class", "w3-bar-item w3-button w3-padding")
    switch (_boton) {
        case "tablero":
            document.getElementById('btnTablero').setAttribute("class", "w3-bar-item w3-button w3-padding w3-blue")
            break;
        case "reportes":
            document.getElementById('btnReporte').setAttribute("class", "w3-bar-item w3-button w3-padding w3-blue")
            break;
        case "mapa":
            document.getElementById('btnMapa').setAttribute("class", "w3-bar-item w3-button w3-padding w3-blue")
            break;
    }
}
