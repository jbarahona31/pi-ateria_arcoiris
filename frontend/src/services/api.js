// Servicio de API — configuración de Axios para comunicación con el backend
import axios from 'axios'

// URL base del backend (configurable por variable de entorno)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró, redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ===== Servicios de Autenticación =====
export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (datos) => api.post('/api/auth/register', datos),
  getUsuarios: () => api.get('/api/auth/usuarios'),
  deleteUsuario: (id) => api.delete(`/api/auth/usuarios/${id}`)
}

// ===== Servicios de Productos =====
export const productosService = {
  getAll: () => api.get('/api/productos'),
  getById: (id) => api.get(`/api/productos/${id}`),
  create: (datos) => api.post('/api/productos', datos),
  update: (id, datos) => api.put(`/api/productos/${id}`, datos),
  delete: (id) => api.delete(`/api/productos/${id}`)
}

// ===== Servicios de Ventas =====
export const ventasService = {
  getAll: () => api.get('/api/ventas'),
  create: (datos) => api.post('/api/ventas', datos),
  getDia: () => api.get('/api/ventas/dia'),
  getMes: () => api.get('/api/ventas/mes')
}

// ===== Servicios de Gastos =====
export const gastosService = {
  getAll: () => api.get('/api/gastos'),
  create: (datos) => api.post('/api/gastos', datos),
  delete: (id) => api.delete(`/api/gastos/${id}`)
}

// ===== Servicios del Dashboard =====
export const dashboardService = {
  getResumen: () => api.get('/api/dashboard')
}

// ===== Servicios de Reportes =====
export const reportesService = {
  getVentasDia: () => api.get('/api/reportes/ventas-dia'),
  getVentasMes: () => api.get('/api/reportes/ventas-mes'),
  getGastos: () => api.get('/api/reportes/gastos'),
  getGanancias: () => api.get('/api/reportes/ganancias'),
  getProductosMasVendidos: () => api.get('/api/reportes/productos-mas-vendidos')
}

export default api
