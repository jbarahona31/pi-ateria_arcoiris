// Controlador de ventas
const db = require('../config/db');

/**
 * Obtener todas las ventas con su detalle
 */
const getVentas = async (req, res) => {
  try {
    const [ventas] = await db.query(
      'SELECT * FROM ventas ORDER BY fecha DESC'
    );

    // Obtener el detalle de cada venta
    for (const venta of ventas) {
      const [detalle] = await db.query(
        `SELECT dv.*, p.nombre as producto_nombre 
         FROM detalle_ventas dv 
         JOIN productos p ON dv.producto_id = p.id 
         WHERE dv.venta_id = ?`,
        [venta.id]
      );
      venta.detalle = detalle;
    }

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Crear una nueva venta con detalle y reducción de inventario
 */
const createVenta = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { items, total } = req.body;

    // Validar que se enviaron los items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto en la venta.' });
    }

    await conn.beginTransaction();

    // Insertar la venta principal
    const [ventaResult] = await conn.query(
      'INSERT INTO ventas (total) VALUES (?)',
      [total]
    );
    const ventaId = ventaResult.insertId;

    // Insertar cada item del detalle y reducir inventario
    for (const item of items) {
      // Verificar que hay suficiente inventario
      const [producto] = await conn.query(
        'SELECT cantidad FROM productos WHERE id = ?',
        [item.producto_id]
      );

      if (producto.length === 0) {
        throw new Error(`Producto con id ${item.producto_id} no encontrado.`);
      }

      if (producto[0].cantidad < item.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto id ${item.producto_id}. Disponible: ${producto[0].cantidad}`
        );
      }

      // Insertar detalle de venta
      await conn.query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
        [ventaId, item.producto_id, item.cantidad, item.precio]
      );

      // Reducir inventario
      await conn.query(
        'UPDATE productos SET cantidad = cantidad - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await conn.commit();

    res.status(201).json({
      mensaje: 'Venta registrada exitosamente.',
      venta_id: ventaId
    });
  } catch (error) {
    await conn.rollback();
    console.error('Error al crear venta:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor.' });
  } finally {
    conn.release();
  }
};

/**
 * Obtener ventas del día actual
 */
const getVentasDia = async (req, res) => {
  try {
    const [ventas] = await db.query(
      `SELECT * FROM ventas 
       WHERE DATE(fecha) = CURDATE() 
       ORDER BY fecha DESC`
    );
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas del día:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Obtener ventas del mes actual
 */
const getVentasMes = async (req, res) => {
  try {
    const [ventas] = await db.query(
      `SELECT * FROM ventas 
       WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())
       ORDER BY fecha DESC`
    );
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas del mes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getVentas, createVenta, getVentasDia, getVentasMes };
