// Página de Reportes — reportes y estadísticas del negocio
import { useState, useEffect } from 'react'
import { reportesService } from '../services/api'
import Card from '../components/Card'

function Reportes() {
  const [ventasDia, setVentasDia] = useState(null)
  const [ventasMes, setVentasMes] = useState(null)
  const [ganancias, setGanancias] = useState(null)
  const [topProductos, setTopProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Cargar todos los reportes al iniciar
  useEffect(() => {
    cargarReportes()
  }, [])

  const cargarReportes = async () => {
    try {
      setCargando(true)
      const [
        resDia,
        resMes,
        resGanancias,
        resProductos
      ] = await Promise.all([
        reportesService.getVentasDia(),
        reportesService.getVentasMes(),
        reportesService.getGanancias(),
        reportesService.getProductosMasVendidos()
      ])

      setVentasDia(resDia.data)
      setVentasMes(resMes.data)
      setGanancias(resGanancias.data)
      setTopProductos(resProductos.data)
    } catch (err) {
      setError('Error al cargar los reportes.')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ fontSize: '1.5rem' }}>⏳ Cargando reportes...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-titulo">📈 Reportes</h1>
        <button className="btn btn-primario" onClick={cargarReportes}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="alerta alerta-error">{error}</div>}

      {/* Tarjetas de resumen */}
      <div className="cards-grid">
        <Card
          titulo="Ventas del Día"
          valor={`Q ${Number(ventasDia?.total || 0).toFixed(2)}`}
          icono="☀️"
          color="verde"
        />
        <Card
          titulo="Ventas del Mes"
          valor={`Q ${Number(ventasMes?.total || 0).toFixed(2)}`}
          icono="📅"
          color="azul"
        />
        <Card
          titulo="Total Gastos"
          valor={`Q ${Number(ganancias?.totalGastos || 0).toFixed(2)}`}
          icono="💸"
          color="rojo"
        />
        <Card
          titulo="Ganancias Totales"
          valor={`Q ${Number(ganancias?.ganancias || 0).toFixed(2)}`}
          icono="💰"
          color={ganancias?.ganancias >= 0 ? 'morado' : 'rojo'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Ventas del día */}
        <div className="tabla-container">
          <div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontWeight: '700', fontSize: '1rem' }}>☀️ Ventas del Día</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Total: Q {Number(ventasDia?.total || 0).toFixed(2)} —
              {ventasDia?.ventas?.length || 0} transacciones
            </p>
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Items</th>
                <th>Total</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {ventasDia?.ventas?.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                    Sin ventas hoy.
                  </td>
                </tr>
              ) : (
                ventasDia?.ventas?.map(v => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td>{v.num_items}</td>
                    <td style={{ fontWeight: '700', color: '#2EC4B6' }}>
                      Q {Number(v.total).toFixed(2)}
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {new Date(v.fecha).toLocaleTimeString('es-GT')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Ventas del mes */}
        <div className="tabla-container">
          <div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6' }}>
            <h2 style={{ fontWeight: '700', fontSize: '1rem' }}>📅 Ventas del Mes</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Total: Q {Number(ventasMes?.total || 0).toFixed(2)} —
              {ventasMes?.ventas?.length || 0} transacciones
            </p>
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Items</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ventasMes?.ventas?.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                    Sin ventas este mes.
                  </td>
                </tr>
              ) : (
                ventasMes?.ventas?.slice(0, 10).map(v => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td>{v.num_items}</td>
                    <td style={{ fontWeight: '700', color: '#4361EE' }}>
                      Q {Number(v.total).toFixed(2)}
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {new Date(v.fecha).toLocaleDateString('es-GT')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="tabla-container" style={{ marginTop: '24px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6' }}>
          <h2 style={{ fontWeight: '700', fontSize: '1rem' }}>🏆 Productos Más Vendidos</h2>
        </div>
        <table className="tabla">
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Total Vendido</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {topProductos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#9CA3AF' }}>
                  Sin datos de ventas todavía.
                </td>
              </tr>
            ) : (
              topProductos.map((p, i) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontSize: '1.2rem' }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{p.nombre}</td>
                  <td>
                    <span className="badge badge-azul">{p.categoria}</span>
                  </td>
                  <td>
                    <span className="badge badge-verde">{p.total_vendido} uds.</span>
                  </td>
                  <td style={{ fontWeight: '700', color: '#2EC4B6' }}>
                    Q {Number(p.total_ingresos).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen de ganancias */}
      <div className="tabla-container" style={{ marginTop: '24px', padding: '24px' }}>
        <h2 style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '20px' }}>
          💰 Resumen de Ganancias
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#F0FDF4', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Total Ventas</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#16A34A' }}>
              Q {Number(ganancias?.totalVentas || 0).toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: '#FEF2F2', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💸</div>
            <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Total Gastos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#DC2626' }}>
              Q {Number(ganancias?.totalGastos || 0).toFixed(2)}
            </div>
          </div>
          <div style={{
            textAlign: 'center', padding: '20px',
            background: ganancias?.ganancias >= 0 ? '#EFF6FF' : '#FEF2F2',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
              {ganancias?.ganancias >= 0 ? '🤑' : '😟'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '4px' }}>Ganancias Netas</div>
            <div style={{
              fontSize: '1.4rem', fontWeight: '800',
              color: ganancias?.ganancias >= 0 ? '#1D4ED8' : '#DC2626'
            }}>
              Q {Number(ganancias?.ganancias || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reportes
