// Modelo de Producto
const db = require('../config/db');

const ProductModel = {
  // Obtener todos los productos
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM productos ORDER BY fecha_registro DESC');
    return rows;
  },

  // Buscar producto por ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
  },

  // Crear producto
  create: async (nombre, categoria, precio, cantidad) => {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, categoria, precio, cantidad) VALUES (?, ?, ?, ?)',
      [nombre, categoria, precio, cantidad]
    );
    return result.insertId;
  },

  // Actualizar producto
  update: async (id, nombre, categoria, precio, cantidad) => {
    await db.query(
      'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, cantidad = ? WHERE id = ?',
      [nombre, categoria, precio, cantidad, id]
    );
  },

  // Eliminar producto
  delete: async (id) => {
    await db.query('DELETE FROM productos WHERE id = ?', [id]);
  }
};

module.exports = ProductModel;
