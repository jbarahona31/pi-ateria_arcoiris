// Página de Login
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  // Enviar el formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const { data } = await authService.login(form.email, form.password)
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Intente de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <span className="login-logo">🌈</span>
        <h1 className="login-titulo">Piñatería y Papelería</h1>
        <p className="login-subtitulo">Arcoiris — Sistema de Gestión</p>

        {error && (
          <div className="alerta alerta-error">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">📧 Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@arcoiris.com"
              required
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">🔒 Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-login"
            disabled={cargando}
          >
            {cargando ? '⏳ Ingresando...' : '✨ Ingresar al sistema'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#9CA3AF' }}>
          Usuario demo: admin@arcoiris.com / admin123
        </p>
      </div>
    </div>
  )
}

export default Login
