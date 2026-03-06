// Rutas de productos
const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require('../controllers/productController');
const { verificarToken } = require('../middleware/authMiddleware');

// GET /api/productos - Obtener todos los productos
router.get('/', verificarToken, getProductos);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', verificarToken, getProductoById);

// POST /api/productos - Crear un nuevo producto
router.post('/', verificarToken, createProducto);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', verificarToken, updateProducto);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', verificarToken, deleteProducto);

module.exports = router;
