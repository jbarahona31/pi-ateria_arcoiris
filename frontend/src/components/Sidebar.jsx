// Componente Sidebar de navegación lateral
import { NavLink } from 'react-router-dom'

// Elementos del menú de navegación
const menuItems = [
  { path: '/', icono: '📊', label: 'Dashboard' },
  { path: '/inventario', icono: '📦', label: 'Inventario' },
  { path: '/ventas', icono: '🛒', label: 'Ventas' },
  { path: '/gastos', icono: '💸', label: 'Gastos' },
  { path: '/reportes', icono: '📈', label: 'Reportes' }
]

function Sidebar() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-emoji">🌈</span>
        <div className="sidebar-titulo">
          Piñatería y<br />Papelería Arcoiris
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icono}</span>
            {item.label}
          </NavLink>
        ))}
        {/* Opción de usuarios solo para admin */}
        {usuario.rol === 'admin' && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <span className="sidebar-link-icon">👥</span>
            Usuarios
          </NavLink>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
