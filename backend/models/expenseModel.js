// Modelo de Gasto
const db = require('../config/db');

const ExpenseModel = {
  // Obtener todos los gastos
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM gastos ORDER BY fecha DESC');
    return rows;
  },

  // Crear gasto
  create: async (concepto, valor) => {
    const [result] = await db.query(
      'INSERT INTO gastos (concepto, valor) VALUES (?, ?)',
      [concepto, valor]
    );
    return result.insertId;
  },

  // Eliminar gasto
  delete: async (id) => {
    await db.query('DELETE FROM gastos WHERE id = ?', [id]);
  }
};

module.exports = ExpenseModel;
