// Rutas del dashboard y reportes
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');

/**
 * GET /api/dashboard - Resumen general del dashboard
 */
router.get('/', verificarToken, async (req, res) => {
  try {
    // Ventas totales del día
    const [[{ ventasDia }]] = await db.query(
      `SELECT COALESCE(SUM(total), 0) as ventasDia FROM ventas WHERE DATE(fecha) = CURDATE()`
    );

    // Total de gastos del día
    const [[{ gastosDia }]] = await db.query(
      `SELECT COALESCE(SUM(valor), 0) as gastosDia FROM gastos WHERE DATE(fecha) = CURDATE()`
    );

    // Total de productos en inventario
    const [[{ totalProductos }]] = await db.query(
      `SELECT COUNT(*) as totalProductos FROM productos`
    );

    // Ganancias del día (ventas - gastos)
    const gananciasDia = parseFloat(ventasDia) - parseFloat(gastosDia);

    res.json({
      ventasDia: parseFloat(ventasDia),
      gastosDia: parseFloat(gastosDia),
      totalProductos,
      gananciasDia
    });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
