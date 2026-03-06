// Modelo de Usuario
const db = require('../config/db');

const UserModel = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  },

  // Buscar usuario por ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  },

  // Crear nuevo usuario
  create: async (nombre, email, passwordHash, rol) => {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, rol]
    );
    return result.insertId;
  },

  // Obtener todos los usuarios (sin contraseña)
  findAll: async () => {
    const [rows] = await db.query('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC');
    return rows;
  }
};

module.exports = UserModel;
