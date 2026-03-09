// Página de Gestión de Usuarios — solo para administradores
import { useState, useEffect } from 'react'
import { authService } from '../services/api'

const FORM_INICIAL = { nombre: '', email: '', password: '', rol: 'empleado' }
const MIN_PASSWORD_LENGTH = 6

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  // Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      const { data } = await authService.getUsuarios()
      setUsuarios(data)
    } catch (err) {
      mostrarMensaje('error', 'Error al cargar los usuarios.')
    } finally {
      setCargando(false)
    }
  }

  // Mostrar alerta temporal
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000)
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Registrar nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setEnviando(true)
      await authService.register(form)
      mostrarMensaje('exito', '✅ Usuario registrado exitosamente.')
      setForm(FORM_INICIAL)
      cargarUsuarios()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al registrar el usuario.')
    } finally {
      setEnviando(false)
    }
  }

  // Eliminar usuario
  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar al usuario "${nombre}"?`)) return
    try {
      await authService.deleteUsuario(id)
      mostrarMensaje('exito', '✅ Usuario eliminado exitosamente.')
      cargarUsuarios()
    } catch (err) {
      mostrarMensaje('error', 'Error al eliminar el usuario.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-titulo">👥 Gestión de Usuarios</h1>
      </div>

      {mensaje.texto && (
        <div className={`alerta alerta-${mensaje.tipo === 'exito' ? 'exito' : 'error'}`}>
          {mensaje.texto}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Formulario para registrar usuario */}
        <div>
          <div className="tabla-container" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>
              ➕ Registrar Usuario
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-input"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ej: juan@arcoiris.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol *</label>
                <select
                  name="rol"
                  className="form-input"
                  value={form.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primario"
                style={{ width: '100%' }}
                disabled={enviando}
              >
                {enviando ? '⏳ Guardando...' : '💾 Registrar Usuario'}
              </button>
            </form>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="tabla-container">
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Cargando usuarios...</div>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha Registro</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                      No hay usuarios registrados aún.
                    </td>
                  </tr>
                ) : (
                  usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td style={{ fontWeight: '600' }}>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`badge ${usuario.rol === 'admin' ? 'badge-azul' : 'badge-verde'}`}>
                          {usuario.rol === 'admin' ? '🔑 Admin' : '👤 Empleado'}
                        </span>
                      </td>
                      <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        {usuario.fecha_creacion
                          ? new Date(usuario.fecha_creacion).toLocaleDateString('es-CO')
                          : '—'}
                      </td>
                      <td>
                        <button
                          className="btn btn-rojo btn-sm"
                          onClick={() => handleEliminar(usuario.id, usuario.nombre)}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Usuarios
