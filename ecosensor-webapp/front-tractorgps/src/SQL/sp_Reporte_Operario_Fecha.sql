BEGIN 
-- _fechaInicio
-- _fechaFin
-- _rutOperario
DECLARE _operarioId INT;
DECLARE _uid VARCHAR(50);
DECLARE _nRegs INT;
DECLARE i INT;
DECLARE _fechaHoraTmp datetime;

-- Sacando cantidad de sensores
SELECT COUNT(*) INTO _nRegs FROM registro_sensor RES WHERE RES.fecha_hora >= _fechaInicio AND RES.fecha_hora <= _fechaFin AND RES.data = _uid;

-- Sacando id de operario
SELECT id into _operarioId FROM operario WHERE rut = _rutOperario;

-- Sacando uid de operario
SELECT uid INTO _uid FROM operario_uid WHERE operarioId = _operarioId;

-- Creando cursor para las  feregistros en registro_sensor
DECLARE cursor_Fechas CURSOR FOR
SELECT sensor_codigo, dispositivo_imei, data, fecha_hora, tipo_evento, ubicacion_id FROM registro_sensor
WHERE RES.fecha_hora >= _fechaInicio AND RES.fecha_hora <= _fechaFin AND RES.data = _uid 
ORDER BY RES.fecha_hora ASC;

-- codigo sensor, imei, data, fecha, tipo_evento, ubicacion_id
-- s1, imei, data, fecha, tipo_evento, ubicacion_id
-- s1, imei, data, fecha, tipo_evento, ubicacion_id
-- s1, imei, data, fecha, tipo_evento, ubicacion_id

OPEN cursor_Fechas;

WHILE i < nRegs DO 
FETCH cursor_Fechas INTO _sensorCodigo, _dispositivoImei, _data, _fechaHora, _tipoEvento, _ubicacionId;
datain = codSen:data:evento
    IF fc_obtieneIdentificador(, "lat") <> "" then
        INSERT INTO tmp_Tabla_Resultado(latitud, longitud, velocidad, fecha_hora, evento)
        values ( fc_obtieneDatosGps(_dataTmp, "lat"), fc_obtieneDatosGps(_dataTmp, "lon"), fc_obtieneDatosGps(_dataTmp, "vel"))
    end if; 
SET i = i + 1;
END WHILE;


-- Eliminando tabla temporal
DROP TEMPORARY TABLE if EXISTS temp_table;
-- Creando tabla temporal
CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Tabla_Resultado(
    latitud VARCHAR(50),
    longitud VARCHAR(50),
    velocidad VARCHAR(50),
    fecha_hora datetime,
    tipo_evento VARCHAR(1)
);


SET i = 0;
SET j = 0;

END