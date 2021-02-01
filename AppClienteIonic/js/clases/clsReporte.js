
class clsReporte {
    async obtieneUbicacion(_imei) {

        var respuesta = await api('post', false, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/validar`, jsonData);
        if (respuesta.data != null) {
            var data = respuesta.data;
            if (data.estado && data.objeto != null) {
                jsonGlobal.usuario.id = data.objeto.id;
                jsonGlobal.usuario.cargo = data.objeto.cargo;
                jsonGlobal.usuario.nombre = data.objeto.nombres + " " + data.objeto.apellidoPaterno + " " + data.objeto.apellidoMaterno;
                jsonGlobal.usuario.usuario = data.objeto.usuario;
                jsonGlobal.empresa_rut = data.objeto.empresa_rut;
                jsonGlobal.reset = data.objeto.reset;
                jsonGlobal.token = data.token;
                retorno = credenciales(1);
            }
        }
        return retorno;
    }
}