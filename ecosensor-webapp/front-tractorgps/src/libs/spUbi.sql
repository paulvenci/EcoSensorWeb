BEGIN

DECLARE totalDispositivos INT;
DECLARE j INT;
DECLARE _imei VARCHAR(50);


DECLARE cur CURSOR FOR 
SELECT DIS.imei 
FROM dispositivo AS DIS
INNER JOIN rfid_operador_dispositivo_usuario CRU ON CRU.dispositivoId = DIS.id
INNER JOIN usuario USU ON CRU.usuarioId = USU.id
WHERE USU.nombreUsuario = _nombreUsuario;

SET totalDispositivos=0;
SELECT COUNT(*) INTO totalDispositivos 
FROM dispositivo AS DIS
INNER JOIN rfid_operador_dispositivo_usuario CRU ON CRU.dispositivoId = DIS.id
INNER JOIN usuario USU ON CRU.usuarioId = USU.id
WHERE USU.nombreUsuario = _nombreUsuario;

DROP TEMPORARY TABLE IF EXISTS tempTabla;
CREATE TEMPORARY TABLE tempTabla(
imei VARCHAR(50), 
latitud VARCHAR(50), 
longitud VARCHAR(50), 
velocidad VARCHAR(50), 
conAcc VARCHAR(2), 
conBat VARCHAR(2), 
operadorNombre VARCHAR(200),
operadorRut VARCHAR(50)
);

SET j = 0;
OPEN cur;
WHILE j<=totalDispositivos DO
    FETCH cur INTO _imei;
    INSERT INTO tempTabla(imei, latitud, longitud, velocidad, conAcc, conBat, operadorNombre, operadorRut)
    SELECT 
        DIS.imei,
        UBI.latitud, 
        UBI.longitud,
        UBI.velocidad,
        UBI.conAcc AS ubiConAcc,
        UBI.conBat AS ubiConBat,
        CONCAT(OPE.nombres, " ", OPE.apellidos),
        OPE.rut
        FROM ubicacion UBI 
        INNER JOIN dispositivo DIS ON DIS.imei = UBI.imei
        INNER JOIN rfid_operador_dispositivo_usuario CRU ON DIS.id = CRU.dispositivoId
        INNER JOIN operador OPE ON OPE.id = CRU.operadorId
        WHERE UBI.imei = _imei
        ORDER BY UBI.id DESC LIMIT 1;
END WHILE;
close cur;
END