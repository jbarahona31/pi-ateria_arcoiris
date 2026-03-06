// Rutas de ventas
const express = require('express');
const router = express.Router();
const { getVentas, createVenta, getVentasDia, getVentasMes } = require('../controllers/salesController');
const { verificarToken } = require('../middleware/authMiddleware');

// GET /api/ventas - Obtener todas las ventas
router.get('/', verificarToken, getVentas);

// GET /api/ventas/dia - Ventas del día actual
router.get('/dia', verificarToken, getVentasDia);

// GET /api/ventas/mes - Ventas del mes actual
router.get('/mes', verificarToken, getVentasMes);

// POST /api/ventas - Crear una nueva venta
router.post('/', verificarToken, createVenta);

module.exports = router;
