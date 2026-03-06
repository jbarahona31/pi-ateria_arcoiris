// Servidor principal de la aplicación Piñatería y Papelería Arcoiris
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Rate limiting =====
// Límite general: 200 peticiones por 15 minutos por IP
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Por favor intente más tarde.' }
});

// Límite estricto para rutas de autenticación
const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de acceso. Por favor intente en 15 minutos.' }
});

// ===== Middlewares =====
// Habilitar CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// ===== Rutas =====
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expensesRoutes = require('./routes/expensesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportesRoutes = require('./routes/reportesRoutes');

// Montar las rutas en sus respectivos prefijos
app.use('/api/auth', limiterAuth, authRoutes);
app.use('/api/productos', limiterGeneral, productRoutes);
app.use('/api/ventas', limiterGeneral, salesRoutes);
app.use('/api/gastos', limiterGeneral, expensesRoutes);
app.use('/api/dashboard', limiterGeneral, dashboardRoutes);
app.use('/api/reportes', limiterGeneral, reportesRoutes);

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Piñatería y Papelería Arcoiris funcionando correctamente 🌈' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🌈 Servidor Arcoiris corriendo en http://localhost:${PORT}`);
});

module.exports = app;
