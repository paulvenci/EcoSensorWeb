class clsUsuario {

    async validar(jsonData) {
        var retorno = false;
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

    async listar() {
        var jsonRespuesta = {
            retorno: false,
            data: null
        };
        var respuesta = await api('get', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario`);
        if (respuesta.data != null) {
            var data = respuesta.data;
            if (data.estado && data.objeto != null) {
                jsonRespuesta.data = data.objeto;
                jsonRespuesta.retorno = true;
            }
        }
        return jsonRespuesta;
    }

    async buscar(id) {
        var jsonRespuesta = {
            retorno: false,
            data: null
        };
        var respuesta = await api('get', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/${id}`);
        if (respuesta.data != null) {
            var data = respuesta.data;
            if (data.estado && data.objeto != null) {
                jsonRespuesta.data = data.objeto;
                jsonRespuesta.retorno = true;
            }
        }
        return jsonRespuesta;
    }

    async buscarRut(rut) {
        var jsonRespuesta = {
            retorno: false,
            data: null
        };
        var respuesta = await api('get', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/rut/${rut}`);
        if (respuesta.data != null) {
            var data = respuesta.data;
            if (data.estado && data.objeto != null) {
                jsonRespuesta.data = data.objeto;
                jsonRespuesta.retorno = true;
            }
        }
        return jsonRespuesta;
    }

    async buscarLogin(login) {
        var jsonRespuesta = {
            retorno: false,
            data: null
        };
        var respuesta = await api('get', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/login/${login}`);
        if (respuesta.data != null) {
            var data = respuesta.data;
            if (data.estado && data.objeto != null) {
                jsonRespuesta.data = data.objeto;
                jsonRespuesta.retorno = true;
            }
        }
        return jsonRespuesta;
    }

    async reset(id) {
        var jsonRespuesta = {
            retorno: false,
            data: null
        };
        var respuesta = await api('get', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/password/${id}`);
        if (respuesta.data != null) {
            var data = respuesta.data;
            if (data.estado && data.objeto != null) {
                jsonRespuesta.data = data.objeto;
                jsonRespuesta.retorno = true;
            }
        }
        return jsonRespuesta;
    }

    async registrar(jsonData) {
        var retorno = false;
        // var respuesta = await api('post', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario`, jsonData);

        if (respuesta.data != null) {
            var data = respuesta.data;
            retorno = data.estado;
        }
        return retorno;
    }

    async modificar(jsonData) {
        var retorno = false;
        var respuesta = await api('put', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/${jsonData.id}`, jsonData);
        if (respuesta.data != null) {
            var data = respuesta.data;
            retorno = data.estado;
        }
        return retorno;
    }

    async eliminar(id) {
        var retorno = false;
        var respuesta = await api('delete', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/${id}`);
        if (respuesta.data != null) {
            var data = respuesta.data;
            retorno = data.estado;
        }
        return retorno;
    }

    async password(jsonData) {
        var retorno = false;
        var respuesta = await api('put', true, `${jsonAPI.protocolo}://${jsonAPI.ip}:${jsonAPI.puerto}/api/usuario/password/${jsonData.id}`, jsonData);
        if (respuesta.data != null) {
            var data = respuesta.data;
            retorno = data.estado;
        }
        return retorno;
    }

}