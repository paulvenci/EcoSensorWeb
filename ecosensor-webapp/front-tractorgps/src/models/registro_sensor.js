//const sql = require("../config/datasource.js");
const mysqlConnection = require('../config/datasource');
const Control = require("../models/control.js");

class Registro_sensor {
    constructor(registro_sensor) {
        this.id = registro_sensor.id;
        this.dispositivo_imei = registro_sensor.dispositivo_imei;
        this.fullData = registro_sensor.fullData;
        this.fecha_hora = registro_sensor.fecha_hora;
        this.latitud = registro_sensor.latitud;
        this.longitud = registro_sensor.longitud;
        this.velocidad = registro_sensor.velocidad;
        this.altura = registro_sensor.altura;
        this.dataS1 = registro_sensor.dataS1;
        this.dataS2 = registro_sensor.dataS2;
        this.dataS3 = registro_sensor.dataS3;
        this.dataS4 = registro_sensor.dataS4;
        this.dataS5 = registro_sensor.dataS5;
        this.dataS6 = registro_sensor.dataS6;
        this.dataS7 = registro_sensor.dataS7;
        this.dataS8 = registro_sensor.dataS8;
        this.dataS9 = registro_sensor.dataS9;
        this.dataS10 = registro_sensor.dataS10;
        this.eventoS1 = registro_sensor.eventoS1;
        this.eventoS2 = registro_sensor.eventoS2;
        this.eventoS3 = registro_sensor.eventoS3;
        this.eventoS4 = registro_sensor.eventoS4;
        this.eventoS5 = registro_sensor.eventoS5;
        this.eventoS6 = registro_sensor.eventoS6;
        this.eventoS7 = registro_sensor.eventoS7;
        this.eventoS8 = registro_sensor.eventoS8;
        this.eventoS9 = registro_sensor.eventoS9;
        this.eventoS10 = registro_sensor.eventoS10;
    }
    static getAllbyImei(imei, result) {
        const query = ` SELECT  id, dispositivo_imei, fullData, fecha_hora, latitud, longitud, velocidad, altura
                        dataS1, dataS2, dataS3, dataS4, dataS5, dataS6,dataS7,dataS8,dataS9,dataS10,
                        eventoS1,eventoS2,eventoS3,eventoS4,eventoS5,eventoS6,eventoS7,eventoS8,eventoS9,eventoS10
                        FROM    registro_sensor
                        WHERE   dispositivo_imei =?`;
        mysqlConnection.query(query, [imei], (err, rows) => {
            if (err) {
                result(err, null);
                return;
            }
            if (rows.length) {
                result(null, rows);
                return;
            }
            result({ kind: "not_found" }, null);
            console.log('Error: ' + err);
            return;
        });
    }
    static getOnebyImei(imei, result) {
        const query = ` SELECT  id, dispositivo_imei, fullData, fecha_hora, latitud, longitud, velocidad, altura
                        dataS1, dataS2, dataS3, dataS4, dataS5, dataS6,dataS7,dataS8,dataS9,dataS10,
                        eventoS1,eventoS2,eventoS3,eventoS4,eventoS5,eventoS6,eventoS7,eventoS8,eventoS9,eventoS10
                        FROM    registro_sensor
                        WHERE   dispositivo_imei =? 
                        ORDER BY fecha_hora DESC 
                        LIMIT 1`;
        mysqlConnection.query(query, [imei], (err, rows) => {
            if (err) {
                result(err, null);
                return;
            }
            if (rows.length) {
                result(null, rows[0]);
                return;
            }
            result({ kind: "not_found" }, null);
            console.log('Error: ' + err);
            return;
        });
    }
    static create = async (registro_sensor, result) => {
        mysqlConnection.query(`INSERT INTO registro_sensor(dispositivo_imei, fullData, fecha_hora, latitud, longitud, velocidad, altura,
                            dataS1, dataS2, dataS3, dataS4, dataS5, dataS6,dataS7,dataS8,dataS9,dataS10,
                            eventoS1,eventoS2,eventoS3,eventoS4,eventoS5,eventoS6,eventoS7,eventoS8,eventoS9,eventoS10)
                            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [registro_sensor.dispositivo_imei, registro_sensor.fullData, registro_sensor.fecha_hora, registro_sensor.latitud, registro_sensor.longitud,
            registro_sensor.velocidad, registro_sensor.altura, registro_sensor.dataS1, registro_sensor.dataS2, registro_sensor.dataS3,
            registro_sensor.dataS4, registro_sensor.dataS5, registro_sensor.dataS6, registro_sensor.dataS7, registro_sensor.dataS8, registro_sensor.dataS9,
            registro_sensor.dataS10, registro_sensor.eventoS1, registro_sensor.eventoS2, registro_sensor.eventoS3, registro_sensor.eventoS4,
            registro_sensor.eventoS5, registro_sensor.eventoS6, registro_sensor.eventoS7, registro_sensor.eventoS8, registro_sensor.eventoS9,
            registro_sensor.eventoS10], (err, res) => {
                if (err) {
                    result(err, null);
                    return;
                }

                Control.getAllbyImei(registro_sensor.dispositivo_imei, (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({ message: err.message || "Ocurrió un error al listar los sensores" })
                        } else {
                            res.status(500).send({ message: `Hubo un error al intentar acceder al Usuario id ${registro_sensor.dispositivo_imei}` });
                        }
                    } else {
                        console.log({ data });
                        //res.status(200).send(data);
                        result(null, data);
                    }
                })


            });
    };
}


module.exports = Registro_sensor;
