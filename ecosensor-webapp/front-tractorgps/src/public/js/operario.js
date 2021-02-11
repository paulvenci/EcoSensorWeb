//* SOCKET EMIT
function oprarioLista(_userName) {
    console.log('EMIT operarioLista => Emit: ' + _userName);
    socket.emit('operarioLista', {
        userName: _userName
    })
}
let operarioObj = [];


function operarioListar(data) {
    operarioObj.length = 0;
    var datosOpe;
    console.log('datos oper: ' + String(data.length));

    data.forEach(element => {
        datosOpe = {
            nombre: element.operario_nombre,
            rut: element.operario_rut,
            empresa_rut: element.operario_empresa_rut,
            estado: element.operario_estado,
            mail: element.operario_mail,
            uid: element.operario_uid
        }
        operarioObj.push(datosOpe);
        console.log(operarioObj);
    })
}