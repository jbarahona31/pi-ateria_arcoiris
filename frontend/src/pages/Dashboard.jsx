// Página del Dashboard — resumen principal del negocio
import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { dashboardService } from '../services/api'

function Dashboard() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const { data } = await dashboardService.getResumen()
      setDatos(data)
    } catch (err) {
      setError('Error al cargar los datos del dashboard.')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  // Formatear como moneda
  const formatearMoneda = (valor) =>
    `Q ${Number(valor || 0).toFixed(2)}`

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ fontSize: '1.5rem' }}>⏳ Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-titulo">📊 Dashboard</h1>
        <button className="btn btn-primario" onClick={cargarDatos}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}

      {/* Tarjetas de resumen */}
      <div className="cards-grid">
        <Card
          titulo="Ventas del Día"
          valor={formatearMoneda(datos?.ventasDia)}
          icono="💰"
          color="verde"
        />
        <Card
          titulo="Gastos del Día"
          valor={formatearMoneda(datos?.gastosDia)}
          icono="💸"
          color="rojo"
        />
        <Card
          titulo="Ganancias del Día"
          valor={formatearMoneda(datos?.gananciasDia)}
          icono="📈"
          color={datos?.gananciasDia >= 0 ? 'azul' : 'rojo'}
        />
        <Card
          titulo="Total Productos"
          valor={datos?.totalProductos || 0}
          icono="📦"
          color="naranja"
        />
      </div>

      {/* Sección de bienvenida */}
      <div className="tabla-container" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🌈</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
          Bienvenido al Sistema de Gestión
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '24px' }}>
          Piñatería y Papelería Arcoiris — Administra tu inventario, ventas y gastos en un solo lugar.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/inventario" className="btn btn-primario">📦 Ir a Inventario</a>
          <a href="/ventas" className="btn btn-verde">🛒 Nueva Venta</a>
          <a href="/reportes" className="btn btn-naranja">📈 Ver Reportes</a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
