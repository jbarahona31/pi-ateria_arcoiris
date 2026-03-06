// Controlador de productos (inventario)
const db = require('../config/db');

/**
 * Obtener todos los productos
 */
const getProductos = async (req, res) => {
  try {
    const [productos] = await db.query(
      'SELECT * FROM productos ORDER BY fecha_registro DESC'
    );
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Obtener un producto por ID
 */
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [productos] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);

    if (productos.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Crear un nuevo producto
 */
const createProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, cantidad } = req.body;

    // Validar campos requeridos
    if (!nombre || precio === undefined || cantidad === undefined) {
      return res.status(400).json({ error: 'Nombre, precio y cantidad son requeridos.' });
    }

    const [resultado] = await db.query(
      'INSERT INTO productos (nombre, categoria, precio, cantidad) VALUES (?, ?, ?, ?)',
      [nombre, categoria || '', precio, cantidad]
    );

    res.status(201).json({
      mensaje: 'Producto creado exitosamente.',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Actualizar un producto existente
 */
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, cantidad } = req.body;

    // Verificar que el producto existe
    const [existe] = await db.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    await db.query(
      'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, cantidad = ? WHERE id = ?',
      [nombre, categoria || '', precio, cantidad, id]
    );

    res.json({ mensaje: 'Producto actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

/**
 * Eliminar un producto
 */
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const [existe] = await db.query('SELECT id FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    await db.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
