// ===== Servidor principal Piñatería y Papelería Arcoiris 🌈 =====
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 🔥 IMPORTANTE: importar la base de datos
const { db } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Rate limiting =====
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones. Intente más tarde.' }
});

const limiterAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de acceso. Intente en 15 minutos.' }
});

// ===== Middlewares =====
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /^https?:\/\/.*\.netlify\.app$/,
    /^https?:\/\/.*\.onrender\.com$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong 🏓');
});

// ===== RUTAS PRINCIPALES =====

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ mensaje: '🌈 API Piñatería y Papelería Arcoiris funcionando correctamente' });
});

// 🔥 RUTA PARA PROBAR BASE DE DATOS
app.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      console.error('Error DB:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: '✅ Conexión a MySQL exitosa 🚀' });
  });
});

// ===== IMPORTAR RUTAS =====
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expensesRoutes = require('./routes/expensesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportesRoutes = require('./routes/reportesRoutes');

// ===== USAR RUTAS =====
app.use('/api/auth', limiterAuth, authRoutes);
app.use('/api/productos', limiterGeneral, productRoutes);
app.use('/api/ventas', limiterGeneral, salesRoutes);
app.use('/api/gastos', limiterGeneral, expensesRoutes);
app.use('/api/dashboard', limiterGeneral, dashboardRoutes);
app.use('/api/reportes', limiterGeneral, reportesRoutes);

// ===== MANEJO DE ERRORES =====

// ❌ Ruta no encontrada (SIEMPRE AL FINAL)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// ❌ Error global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`🌈 Servidor Arcoiris corriendo en puerto ${PORT}`);
});

module.exports = app;
