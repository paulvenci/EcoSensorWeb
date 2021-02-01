//const sql = require("../config/datasource.js");
const mysqlConnection = require('../config/datasource');
const Control = require("../models/control.js");
const moment = require("../../node_modules/moment")

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
            // console.log('Error: ' + err);
            return;
        });
    }

    static create(registro_sensor, result) {
        var lat, lon, vel, alt, ds1, ds2, ds3, ds4, ds5, ds6, ds7, ds8, ds9, ds10;
        lat = registro_sensor.latitud;
        lon = registro_sensor.longitud;
        vel = registro_sensor.velocidad;
        alt = registro_sensor.altura;
        ds1 = registro_sensor.dataS1;
        ds2 = registro_sensor.dataS2;
        ds3 = registro_sensor.dataS3;
        ds4 = registro_sensor.dataS4;
        ds5 = registro_sensor.dataS5;
        ds6 = registro_sensor.dataS6;
        ds7 = registro_sensor.dataS7;
        ds8 = registro_sensor.dataS8;
        ds9 = registro_sensor.dataS8;
        ds10 = registro_sensor.dataS10;
        if (registro_sensor.latitud.trim() == '') { lat = null };
        if (registro_sensor.longitud.trim() == '') { lon = null };
        if (registro_sensor.altura.trim() == '') { alt = null };
        if (registro_sensor.velocidad.trim() == '') { vel = null };
        if (registro_sensor.dataS1.trim() == '') { ds1 = null };
        if (registro_sensor.dataS2.trim() == '') { ds2 = null };
        if (registro_sensor.dataS3.trim() == '') { ds3 = null };
        if (registro_sensor.dataS4.trim() == '') { ds4 = null };
        if (registro_sensor.dataS5.trim() == '') { ds5 = null };

        mysqlConnection.query(`INSERT INTO registro_sensor(
            dispositivo_imei, 
            fullData, 
            fecha_hora, 
            latitud, 
            longitud, 
            velocidad, 
            altura,
            dataS1, dataS2, dataS3, dataS4, dataS5, dataS6,dataS7,dataS8,dataS9,dataS10,
            eventoS1,eventoS2,eventoS3,eventoS4,eventoS5,eventoS6,eventoS7,eventoS8,eventoS9,eventoS10)
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [registro_sensor.dispositivo_imei,
            registro_sensor.fullData,
            registro_sensor.fecha_hora,
                lat, lon, vel, alt,
                ds1, ds2, ds3, ds4, ds5,
            registro_sensor.dataS6,
            registro_sensor.dataS7,
            registro_sensor.dataS8,
            registro_sensor.dataS9,
            registro_sensor.dataS10,
            registro_sensor.eventoS1,
            registro_sensor.eventoS2,
            registro_sensor.eventoS3,
            registro_sensor.eventoS4,
            registro_sensor.eventoS5,
            registro_sensor.eventoS6,
            registro_sensor.eventoS7,
            registro_sensor.eventoS8,
            registro_sensor.eventoS9,
            registro_sensor.eventoS10], (err, rows) => {
                if (err) {
                    result(err, null);
                    return;
                }

                Control.getAllbyImei(registro_sensor.dispositivo_imei, (err, data) => {
                    console.log('data: ' + data);

                    if (err) {
                        if (err.kind === "not_found") {
                            result(null, "No se encontró IMEI: " + registro_sensor.dispositivo_imei)
                        } else {
                            result(err, `Hubo un error al intentar acceder imei ${registro_sensor.dispositivo_imei}`);
                        }
                    } else {
                        console.log({ data });
                        result(null, data);
                    };
                });
            });
    }
}

module.exports = Registro_sensor;
