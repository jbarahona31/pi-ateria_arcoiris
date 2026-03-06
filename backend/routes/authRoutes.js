// Rutas de autenticación
const express = require('express');
const router = express.Router();
const { login, register, getUsuarios, deleteUsuario } = require('../controllers/authController');
const { verificarToken, soloAdmin } = require('../middleware/authMiddleware');

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// POST /api/auth/register - Registrar usuario
router.post('/register', register);

// GET /api/auth/usuarios - Obtener todos los usuarios (solo admin)
router.get('/usuarios', verificarToken, soloAdmin, getUsuarios);

// DELETE /api/auth/usuarios/:id - Eliminar usuario (solo admin)
router.delete('/usuarios/:id', verificarToken, soloAdmin, deleteUsuario);

module.exports = router;
