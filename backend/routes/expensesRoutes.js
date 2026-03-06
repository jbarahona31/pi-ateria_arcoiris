// Rutas de gastos
const express = require('express');
const router = express.Router();
const { getGastos, createGasto, deleteGasto } = require('../controllers/expensesController');
const { verificarToken } = require('../middleware/authMiddleware');

// GET /api/gastos - Obtener todos los gastos
router.get('/', verificarToken, getGastos);

// POST /api/gastos - Registrar un nuevo gasto
router.post('/', verificarToken, createGasto);

// DELETE /api/gastos/:id - Eliminar un gasto
router.delete('/:id', verificarToken, deleteGasto);

module.exports = router;
