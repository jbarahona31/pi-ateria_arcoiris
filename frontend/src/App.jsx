import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventario from './pages/Inventario'
import Ventas from './pages/Ventas'
import Gastos from './pages/Gastos'
import Reportes from './pages/Reportes'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

// Componente para rutas protegidas (requieren autenticación)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Layout principal con sidebar y navbar
const MainLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con layout */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/inventario" element={
          <PrivateRoute>
            <MainLayout>
              <Inventario />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/ventas" element={
          <PrivateRoute>
            <MainLayout>
              <Ventas />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/gastos" element={
          <PrivateRoute>
            <MainLayout>
              <Gastos />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/reportes" element={
          <PrivateRoute>
            <MainLayout>
              <Reportes />
            </MainLayout>
          </PrivateRoute>
        } />

        {/* Redirigir rutas desconocidas al dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
