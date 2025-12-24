CREATE DATABASE neko_mori;
USE neko_mori;

CREATE TABLE adopciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_gato VARCHAR(50),
    nombre_adoptante VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    motivacion TEXT
);
