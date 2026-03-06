// Página de Gastos — registro y listado de gastos del negocio
import { useState, useEffect } from 'react'
import { gastosService } from '../services/api'

function Gastos() {
  const [gastos, setGastos] = useState([])
  const [form, setForm] = useState({ concepto: '', valor: '' })
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [enviando, setEnviando] = useState(false)

  // Cargar gastos al iniciar
  useEffect(() => {
    cargarGastos()
  }, [])

  const cargarGastos = async () => {
    try {
      setCargando(true)
      const { data } = await gastosService.getAll()
      setGastos(data)
    } catch (err) {
      mostrarMensaje('error', 'Error al cargar los gastos.')
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

  // Registrar nuevo gasto
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setEnviando(true)
      await gastosService.create({
        concepto: form.concepto,
        valor: parseFloat(form.valor)
      })
      mostrarMensaje('exito', '✅ Gasto registrado exitosamente.')
      setForm({ concepto: '', valor: '' })
      cargarGastos()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al registrar el gasto.')
    } finally {
      setEnviando(false)
    }
  }

  // Eliminar gasto
  const handleEliminar = async (id, concepto) => {
    if (!window.confirm(`¿Eliminar el gasto "${concepto}"?`)) return
    try {
      await gastosService.delete(id)
      mostrarMensaje('exito', '✅ Gasto eliminado exitosamente.')
      cargarGastos()
    } catch (err) {
      mostrarMensaje('error', 'Error al eliminar el gasto.')
    }
  }

  // Calcular total de gastos
  const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.valor), 0)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-titulo">💸 Gestión de Gastos</h1>
      </div>

      {mensaje.texto && (
        <div className={`alerta alerta-${mensaje.tipo === 'exito' ? 'exito' : 'error'}`}>
          {mensaje.texto}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Formulario para agregar gasto */}
        <div>
          <div className="tabla-container" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>
              ➕ Registrar Gasto
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Concepto *</label>
                <input
                  type="text"
                  name="concepto"
                  className="form-input"
                  value={form.concepto}
                  onChange={handleChange}
                  placeholder="Ej: Compra de materiales"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Valor (Q) *</label>
                <input
                  type="number"
                  name="valor"
                  className="form-input"
                  value={form.valor}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primario"
                style={{ width: '100%' }}
                disabled={enviando}
              >
                {enviando ? '⏳ Guardando...' : '💾 Registrar Gasto'}
              </button>
            </form>
          </div>

          {/* Tarjeta de total */}
          <div className="card card-rojo" style={{ marginTop: '16px' }}>
            <span className="card-icono">💸</span>
            <div className="card-titulo">Total en Gastos</div>
            <div className="card-valor">Q {totalGastos.toFixed(2)}</div>
          </div>
        </div>

        {/* Tabla de gastos */}
        <div className="tabla-container">
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Cargando gastos...</div>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Concepto</th>
                  <th>Valor</th>
                  <th>Fecha</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {gastos.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                      No hay gastos registrados aún.
                    </td>
                  </tr>
                ) : (
                  gastos.map(gasto => (
                    <tr key={gasto.id}>
                      <td>{gasto.id}</td>
                      <td style={{ fontWeight: '600' }}>{gasto.concepto}</td>
                      <td style={{ color: '#EF4444', fontWeight: '700' }}>
                        Q {Number(gasto.valor).toFixed(2)}
                      </td>
                      <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                        {new Date(gasto.fecha).toLocaleDateString('es-GT')}
                      </td>
                      <td>
                        <button
                          className="btn btn-rojo btn-sm"
                          onClick={() => handleEliminar(gasto.id, gasto.concepto)}
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

export default Gastos
