// Modelo de Venta
const db = require('../config/db');

const SaleModel = {
  // Obtener todas las ventas
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM ventas ORDER BY fecha DESC');
    return rows;
  },

  // Crear venta
  create: async (total, conn) => {
    const [result] = await conn.query('INSERT INTO ventas (total) VALUES (?)', [total]);
    return result.insertId;
  },

  // Crear detalle de venta
  createDetalle: async (ventaId, productoId, cantidad, precio, conn) => {
    await conn.query(
      'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
      [ventaId, productoId, cantidad, precio]
    );
  }
};

module.exports = SaleModel;
