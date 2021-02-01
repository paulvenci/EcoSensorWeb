BEGIN -- Parámetro: _nombreUsuario varchar(200)
DECLARE totalDispositivos INT;
DECLARE j INT;
DECLARE i INT;
DECLARE _imei VARCHAR(50);
DECLARE _totalSensor INT;
DECLARE _sensor_tipo VARCHAR(1);
DECLARE _operario_nombre_completo VARCHAR(2000);
DECLARE _operario_rut VARCHAR(50);
DECLARE _operario_estado INT;
DECLARE _registro_sensor_fullDataTmp varchar(10000);
DECLARE _registro_sensor_fullData varchar(10000);
DECLARE _registro_sensor_fecha_hora DATETIME;
DECLARE _registro_sensor_data VARCHAR(10000);
DECLARE _codigoSensorTmp VARCHAR (100);
declare _latitud varchar(50);
declare _longitud varchar(50);
declare _velocidad varchar(10);
-- Sacando datos de Registro Sensores
DECLARE cur_sensor CURSOR FOR
SELECT CONCAT(
        "(",
        RSE.sensor_codigo,
        ":",
        RSE.data,
        ":",
        RSE.tipo_evento,
        ")"
    ),
    RSE.data
FROM dispositivo DIS
    INNER JOIN dispositivo_usuario DIS_USU ON DIS.id = DIS_USU.dispositivo_id
    INNER JOIN registro_sensor RSE ON RSE.dispositivo_imei = DIS.imei
    INNER JOIN usuario USU ON USU.id = DIS_USU.usuario_id
WHERE USU.nombre_usuario = _nombreUsuario
    AND DIS.imei = _imei
ORDER BY fecha_hora DESC,
    sensor_codigo ASC
LIMIT _totalSensor;
-- Sacando total de dispositivos del usuario
DECLARE cur CURSOR FOR
SELECT DISTINCT DIS.imei
FROM usuario AS USU
    INNER JOIN dispositivo_usuario DIUS ON DIUS.usuario_id = USU.id
    INNER JOIN dispositivo DIS ON DIS.id = DIUS.dispositivo_id
WHERE USU.nombre_usuario = _nombreUsuario;
SET totalDispositivos = 0;
SELECT COUNT(DISTINCT DIS.imei) INTO totalDispositivos
FROM usuario AS USU
    INNER JOIN dispositivo_usuario DIUS ON DIUS.usuario_id = USU.id
    INNER JOIN dispositivo DIS ON DIS.id = DIUS.dispositivo_id
WHERE USU.nombre_usuario = _nombreUsuario;
-- Creando tabla temporal de salida
DROP TEMPORARY TABLE IF EXISTS tempTabla;
CREATE TEMPORARY TABLE tempTabla(
    dispositivo_nombre VARCHAR(50),
    dispositivo_descripcion VARCHAR(2000),
    dispositivo_marca VARCHAR(50),
    dispositivo_modelo VARCHAR(50),
    dispositivo_estado VARCHAR(1),
    dispositivo_imei VARCHAR(100),
    dispositivo_grupo int,
    dispositivo_chip_telefono VARCHAR(50),
    dispositivo_chip_compañia VARCHAR(50),
    usuario_nombre_completo varchar(200),
    usuario_nombre_usuario VARCHAR(100),
    usuario_empresa_rut varchar(20),
    usuario_email varchar(1000),
    usuario_estado varchar(1),
    registro_sensor_fullData varchar(10000),
    registro_sensor_fecha_hora DATETIME,
    operario_nombre_completo VARCHAR (2000),
    operario_rut VARCHAR (50),
    operario_estado INT,
    ubicacion_latitud VARCHAR(50),
    ubicacion_longitud VARCHAR(50),
    ubicacion_velocidad VARCHAR(10)
);
SET j = 0;
OPEN cur;
WHILE j < totalDispositivos DO FETCH cur INTO _imei;
SET i = 0;
SELECT COUNT(*) into _totalSensor
FROM sensor SEN
WHERE SEN.dispositivo_imei = _imei;
OPEN cur_sensor;
while i < _totalSensor DO FETCH cur_sensor INTO _registro_sensor_fullDataTmp,
_registro_sensor_data;
if _totalSensor = 1 then
SET _registro_sensor_fullData = _registro_sensor_fullDataTmp;
else
SET _registro_sensor_fullData = CONCAT_WS (
        ";",
        _registro_sensor_fullData,
        _registro_sensor_fullDataTmp
    );
END if;
SET i = i + 1;
END while;
close cur_sensor;
-- Sacando datos de operario
SET _operario_nombre_completo = fc_buscaOperadorNombre(_registro_sensor_fullData, _imei);
SET _operario_rut = fc_buscaOperadorRut(_registro_sensor_fullData, _imei);
SET _operario_estado = fc_buscaOperadorEstado(_registro_sensor_fullData, _imei);
-- insertando datos en tabla
INSERT INTO tempTabla(
        dispositivo_nombre,
        dispositivo_descripcion,
        dispositivo_marca,
        dispositivo_modelo,
        dispositivo_estado,
        dispositivo_imei,
        dispositivo_grupo,
        dispositivo_chip_telefono,
        dispositivo_chip_compañia,
        usuario_nombre_completo,
        usuario_nombre_usuario,
        usuario_empresa_rut,
        usuario_email,
        usuario_estado,
        registro_sensor_fullData,
        registro_sensor_fecha_hora,
        operario_nombre_completo,
        operario_rut,
        operario_estado
    )
SELECT DIS.nombre,
    DIS.descripcion,
    DIS.marca,
    DIS.modelo,
    DIS.estado,
    DIS.imei,
    DIS.grupo_id,
    DIS.chip_telefono,
    DIS.chip_compañia,
    USU.nombre_completo,
    USU.nombre_usuario,
    USU.empresa_rut,
    USU.email,
    USU.estado,
    _registro_sensor_fullData,
    RSE.fecha_hora,
    _operario_nombre_completo,
    _operario_rut,
    _operario_estado,
    (
        select latitud
        from ubicacion
        where dispositivo_imei = DIS.imei
            and fechaHora = RSE.fecha_hora
    ),
    (
        select longitud
        from ubicacion
        where dispositivo_imei = DIS.imei
            and fechaHora = RSE.fecha_hora
    ),
    (
        select velocidad
        from ubicacion
        where dispositivo_imei = DIS.imei
            and fechaHora = RSE.fecha_hora
    )
FROM dispositivo DIS
    INNER JOIN dispositivo_usuario DIS_USU ON DIS.id = DIS_USU.dispositivo_id
    INNER JOIN registro_sensor RSE ON RSE.dispositivo_imei = DIS.imei
    INNER JOIN usuario USU ON USU.id = DIS_USU.usuario_id
WHERE USU.nombre_usuario = _nombreUsuario
    AND DIS.imei = _imei
ORDER BY fecha_hora DESC,
    sensor_codigo ASC
LIMIT 1;
SET j = j + 1;
SET _registro_sensor_fullData = "";
END WHILE;
CLOSE cur;
-- SELECT tt;
SELECT *
FROM tempTabla;
END