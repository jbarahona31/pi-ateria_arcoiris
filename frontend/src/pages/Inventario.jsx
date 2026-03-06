// Página de Inventario — CRUD completo de productos
import { useState, useEffect } from 'react'
import { productosService } from '../services/api'

const FORM_INICIAL = { nombre: '', categoria: '', precio: '', cantidad: '' }

function Inventario() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null) // null = creando, id = editando
  const [form, setForm] = useState(FORM_INICIAL)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      setCargando(true)
      const { data } = await productosService.getAll()
      setProductos(data)
    } catch (err) {
      mostrarMensaje('error', 'Error al cargar los productos.')
    } finally {
      setCargando(false)
    }
  }

  // Mostrar alerta temporal
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto })
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000)
  }

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Abrir modal para crear
  const abrirModalCrear = () => {
    setEditando(null)
    setForm(FORM_INICIAL)
    setModalAbierto(true)
  }

  // Abrir modal para editar
  const abrirModalEditar = (producto) => {
    setEditando(producto.id)
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      cantidad: producto.cantidad
    })
    setModalAbierto(true)
  }

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false)
    setForm(FORM_INICIAL)
    setEditando(null)
  }

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Guardar producto (crear o editar)
  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      const datos = {
        nombre: form.nombre,
        categoria: form.categoria,
        precio: parseFloat(form.precio),
        cantidad: parseInt(form.cantidad)
      }

      if (editando) {
        await productosService.update(editando, datos)
        mostrarMensaje('exito', '✅ Producto actualizado exitosamente.')
      } else {
        await productosService.create(datos)
        mostrarMensaje('exito', '✅ Producto creado exitosamente.')
      }

      cerrarModal()
      cargarProductos()
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al guardar el producto.')
    }
  }

  // Eliminar producto
  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de eliminar el producto "${nombre}"?`)) return
    try {
      await productosService.delete(id)
      mostrarMensaje('exito', '✅ Producto eliminado exitosamente.')
      cargarProductos()
    } catch (err) {
      mostrarMensaje('error', 'Error al eliminar el producto.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-titulo">📦 Inventario de Productos</h1>
        <button className="btn btn-primario" onClick={abrirModalCrear}>
          ➕ Agregar Producto
        </button>
      </div>

      {/* Mensajes de alerta */}
      {mensaje.texto && (
        <div className={`alerta alerta-${mensaje.tipo === 'exito' ? 'exito' : 'error'}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Búsqueda */}
      <div className="busqueda-container">
        <input
          type="text"
          className="busqueda-input"
          placeholder="🔍 Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla de productos */}
      <div className="tabla-container">
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Cargando productos...</div>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td style={{ fontWeight: '600' }}>{p.nombre}</td>
                    <td>
                      <span className="badge badge-azul">{p.categoria || '—'}</span>
                    </td>
                    <td>Q {Number(p.precio).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.cantidad <= 5 ? 'badge-rojo' : 'badge-verde'}`}>
                        {p.cantidad}
                      </span>
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                      {new Date(p.fecha_registro).toLocaleDateString('es-GT')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-naranja btn-sm"
                          onClick={() => abrirModalEditar(p)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-rojo btn-sm"
                          onClick={() => handleEliminar(p.id, p.nombre)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para crear/editar producto */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-titulo">
              {editando ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}
            </h2>
            <form onSubmit={handleGuardar}>
              <div className="form-group">
                <label className="form-label">Nombre del producto *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-input"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Piñata Estrella"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  className="form-input"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ej: Piñatas, Papelería, Globos..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Precio (Q) *</label>
                <input
                  type="number"
                  name="precio"
                  className="form-input"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad en stock *</label>
                <input
                  type="number"
                  name="cantidad"
                  className="form-input"
                  value={form.cantidad}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="modal-acciones">
                <button type="button" className="btn" onClick={cerrarModal}
                  style={{ background: '#F3F4F6', color: '#374151' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primario">
                  {editando ? '💾 Actualizar' : '✅ Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario
