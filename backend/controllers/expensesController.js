// Controlador de gastos
const db = require('../config/db');

/**
 * Obtener todos los gastos
 */
const getGastos = async (req, res) => {
  try {
    const [gastos] = await db.query(
      'SELECT * FROM gastos ORDER BY fecha DESC'
    );
    res.json(gastos);
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Registrar un nuevo gasto
 */
const createGasto = async (req, res) => {
  try {
    const { concepto, valor } = req.body;

    // Validar campos requeridos
    if (!concepto || valor === undefined) {
      return res.status(400).json({ error: 'Concepto y valor son requeridos.' });
    }

    const [resultado] = await db.query(
      'INSERT INTO gastos (concepto, valor) VALUES (?, ?)',
      [concepto, valor]
    );

    res.status(201).json({
      mensaje: 'Gasto registrado exitosamente.',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Eliminar un gasto
 */
const deleteGasto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el gasto existe
    const [existe] = await db.query('SELECT id FROM gastos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Gasto no encontrado.' });
    }

    await db.query('DELETE FROM gastos WHERE id = ?', [id]);
    res.json({ mensaje: 'Gasto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getGastos, createGasto, deleteGasto };
