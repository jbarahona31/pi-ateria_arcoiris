-- Base de datos para Piñatería y Papelería Arcoiris
-- Sistema de gestión de inventario, ventas y contabilidad

CREATE DATABASE IF NOT EXISTS arcoiris_db;

USE arcoiris_db;

-- Tabla de usuarios del sistema
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','empleado') DEFAULT 'empleado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos del inventario
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(100),
  precio DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL DEFAULT 0,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas (encabezado)
CREATE TABLE ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de gastos del negocio
CREATE TABLE gastos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concepto VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo: usuario administrador (contraseña: admin123)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Administrador', 'admin@arcoiris.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lH36', 'admin');

-- Datos de ejemplo: productos iniciales
INSERT INTO productos (nombre, categoria, precio, cantidad) VALUES
('Piñata Estrella', 'Piñatas', 25.00, 15),
('Papel Crepe Rojo', 'Papel', 5.00, 50),
('Globos de Látex x10', 'Globos', 8.50, 30),
('Listón Dorado', 'Decoración', 3.00, 100),
('Confeti Multicolor', 'Decoración', 2.50, 80),
('Cuaderno Rayado', 'Papelería', 12.00, 45),
('Lápices x12', 'Papelería', 15.00, 25),
('Tijeras Escolares', 'Papelería', 8.00, 20);
