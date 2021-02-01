BEGIN 
-- USO: Registra datos de sensores y retorna datos de controles de imei dado

INSERT INTO registro_sensor (
	dispositivo_imei,
	fullData, 
	fecha_hora, 
	latitud,
	longitud, 
	velocidad, 
	altura, 
	dataS1,
	dataS2,
	dataS3,
	dataS4,
	dataS5,
	dataS6,
	dataS7,
	dataS8,
	dataS9,
	dataS10,
	eventoS1,
	eventoS2,
	eventoS3,
	eventoS4,
	eventoS5,
	eventoS6,
	eventoS7,
	eventoS8,
	eventoS9,
	eventoS10)
	values(_dispositivoImei, _fullData, _fechaHora, _latitud, _longitud, _velocidad, _alturadataS1,
	dataS2,	dataS3,	dataS4,	dataS5,	dataS6,	dataS7,	dataS8,	dataS9,	dataS10, eventoS1, eventoS2, eventoS3,
	eventoS4, eventoS5,	eventoS6, eventoS7,	eventoS8, eventoS9, eventoS10)


-- Devolviendo estado de controles para el imei dado
SELECT nombre AS control_nombre,
	descripcion AS control_descripcion,
	marca AS control_marca,
	modelo AS control_modelo,
	dispositivo_imei AS control_dispositivo_imei,
	estado AS control_estado
FROM control
WHERE dispositivo_imei = imei;
END