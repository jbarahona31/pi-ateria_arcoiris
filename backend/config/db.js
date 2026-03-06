// Configuración de la conexión a la base de datos MySQL
const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arcoiris_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar pool con soporte de promesas
const promisePool = pool.promise();

module.exports = promisePool;
