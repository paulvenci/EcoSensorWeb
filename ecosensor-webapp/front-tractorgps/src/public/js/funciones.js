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


// Conclusión
(function () {
    /**
     * Ajuste decimal de un número.
     *
     * @param {String}  tipo  El tipo de ajuste.
     * @param {Number}  valor El numero.
     * @param {Integer} exp   El exponente (el logaritmo 10 del ajuste base).
     * @returns {Number} El valor ajustado.
     */
    function decimalAdjust(type, value, exp) {
        // Si el exp no está definido o es cero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Si el valor no es un número o el exp no es un entero...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();