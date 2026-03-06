// Servidor principal de la aplicación Piñatería y Papelería Arcoiris
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/ventas', salesRoutes);
app.use('/api/gastos', expensesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);

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
