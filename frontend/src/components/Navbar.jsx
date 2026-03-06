// Componente Navbar superior
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  // Obtener datos del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span style={{ fontSize: '1.5rem' }}>🌈</span>
        <span className="navbar-titulo">Piñatería y Papelería Arcoiris</span>
      </div>
      <div className="navbar-usuario">
        <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
          👤 {usuario.nombre || 'Usuario'}
          {usuario.rol === 'admin' && (
            <span className="badge badge-azul" style={{ marginLeft: '8px' }}>Admin</span>
          )}
        </span>
        <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default Navbar
