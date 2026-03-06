// Rutas de reportes
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verificarToken } = require('../middleware/authMiddleware');

/**
 * GET /api/reportes/ventas-dia - Reporte de ventas del día
 */
router.get('/ventas-dia', verificarToken, async (req, res) => {
  try {
    const [ventas] = await db.query(
      `SELECT v.*, 
              COUNT(dv.id) as num_items
       FROM ventas v
       LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
       WHERE DATE(v.fecha) = CURDATE()
       GROUP BY v.id
       ORDER BY v.fecha DESC`
    );
    const [[{ total }]] = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total FROM ventas WHERE DATE(fecha) = CURDATE()`
    );
    res.json({ ventas, total: parseFloat(total) });
  } catch (error) {
    console.error('Error en reporte ventas-dia:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * GET /api/reportes/ventas-mes - Reporte de ventas del mes
 */
router.get('/ventas-mes', verificarToken, async (req, res) => {
  try {
    const [ventas] = await db.query(
      `SELECT v.*,
              COUNT(dv.id) as num_items
       FROM ventas v
       LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
       WHERE MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE())
       GROUP BY v.id
       ORDER BY v.fecha DESC`
    );
    const [[{ total }]] = await db.query(
      `SELECT COALESCE(SUM(total), 0) as total 
       FROM ventas 
       WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())`
    );
    res.json({ ventas, total: parseFloat(total) });
  } catch (error) {
    console.error('Error en reporte ventas-mes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * GET /api/reportes/gastos - Reporte de gastos totales
 */
router.get('/gastos', verificarToken, async (req, res) => {
  try {
    const [gastos] = await db.query('SELECT * FROM gastos ORDER BY fecha DESC');
    const [[{ total }]] = await db.query(
      `SELECT COALESCE(SUM(valor), 0) as total FROM gastos`
    );
    res.json({ gastos, total: parseFloat(total) });
  } catch (error) {
    console.error('Error en reporte gastos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * GET /api/reportes/ganancias - Reporte de ganancias
 */
router.get('/ganancias', verificarToken, async (req, res) => {
  try {
    const [[{ totalVentas }]] = await db.query(
      `SELECT COALESCE(SUM(total), 0) as totalVentas FROM ventas`
    );
    const [[{ totalGastos }]] = await db.query(
      `SELECT COALESCE(SUM(valor), 0) as totalGastos FROM gastos`
    );
    const ganancias = parseFloat(totalVentas) - parseFloat(totalGastos);
    res.json({
      totalVentas: parseFloat(totalVentas),
      totalGastos: parseFloat(totalGastos),
      ganancias
    });
  } catch (error) {
    console.error('Error en reporte ganancias:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * GET /api/reportes/productos-mas-vendidos - Productos más vendidos
 */
router.get('/productos-mas-vendidos', verificarToken, async (req, res) => {
  try {
    const [productos] = await db.query(
      `SELECT p.id, p.nombre, p.categoria, 
              SUM(dv.cantidad) as total_vendido,
              SUM(dv.cantidad * dv.precio) as total_ingresos
       FROM detalle_ventas dv
       JOIN productos p ON dv.producto_id = p.id
       GROUP BY p.id, p.nombre, p.categoria
       ORDER BY total_vendido DESC
       LIMIT 10`
    );
    res.json(productos);
  } catch (error) {
    console.error('Error en reporte productos-mas-vendidos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
