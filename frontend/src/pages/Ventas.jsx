// Página de Ventas — sistema POS (punto de venta)
import { useState, useEffect } from 'react'
import { productosService, ventasService } from '../services/api'

function Ventas() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState([])
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
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
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000)
  }

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    p.cantidad > 0
  )

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const existente = carrito.find(item => item.producto_id === producto.id)
    if (existente) {
      // Verificar stock disponible
      if (existente.cantidad >= producto.cantidad) {
        mostrarMensaje('error', `Stock insuficiente para "${producto.nombre}".`)
        return
      }
      // Incrementar cantidad
      setCarrito(carrito.map(item =>
        item.producto_id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      setCarrito([...carrito, {
        producto_id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        cantidad: 1,
        stock: producto.cantidad
      }])
    }
  }

  // Cambiar cantidad en el carrito
  const cambiarCantidad = (productoId, delta) => {
    setCarrito(carrito
      .map(item => {
        if (item.producto_id === productoId) {
          const nuevaCantidad = item.cantidad + delta
          if (nuevaCantidad > item.stock) {
            mostrarMensaje('error', `Stock máximo: ${item.stock}`)
            return item
          }
          return { ...item, cantidad: nuevaCantidad }
        }
        return item
      })
      .filter(item => item.cantidad > 0) // Remover si cantidad llega a 0
    )
  }

  // Eliminar item del carrito
  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.producto_id !== productoId))
  }

  // Calcular total del carrito
  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  // Finalizar venta
  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      mostrarMensaje('error', 'El carrito está vacío. Agregue productos para realizar una venta.')
      return
    }

    try {
      setProcesando(true)
      await ventasService.create({
        items: carrito.map(({ producto_id, cantidad, precio }) => ({
          producto_id,
          cantidad,
          precio
        })),
        total: totalCarrito
      })

      mostrarMensaje('exito', `✅ Venta registrada exitosamente. Total: Q ${totalCarrito.toFixed(2)}`)
      setCarrito([])
      cargarProductos() // Actualizar stock
    } catch (err) {
      mostrarMensaje('error', err.response?.data?.error || 'Error al procesar la venta.')
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-titulo">🛒 Punto de Venta</h1>
      </div>

      {mensaje.texto && (
        <div className={`alerta alerta-${mensaje.tipo === 'exito' ? 'exito' : 'error'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="ventas-layout">
        {/* Panel izquierdo: catálogo de productos */}
        <div>
          <div className="busqueda-container">
            <input
              type="text"
              className="busqueda-input"
              placeholder="🔍 Buscar productos disponibles..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {cargando ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Cargando productos...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {productosFiltrados.length === 0 ? (
                <p style={{ color: '#9CA3AF', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                  No hay productos disponibles con ese nombre.
                </p>
              ) : (
                productosFiltrados.map(producto => (
                  <div
                    key={producto.id}
                    className="card"
                    style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                    onClick={() => agregarAlCarrito(producto)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎁</div>
                    <div style={{ fontWeight: '700', marginBottom: '4px', fontSize: '0.95rem' }}>
                      {producto.nombre}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '0.8rem', marginBottom: '8px' }}>
                      {producto.categoria}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#4361EE' }}>
                      Q {Number(producto.precio).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>
                      Stock: {producto.cantidad}
                    </div>
                    <button
                      className="btn btn-verde btn-sm"
                      style={{ width: '100%', marginTop: '12px' }}
                      onClick={(e) => { e.stopPropagation(); agregarAlCarrito(producto) }}
                    >
                      ➕ Agregar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Panel derecho: carrito de compra */}
        <div className="carrito">
          <div className="carrito-titulo">🛒 Carrito de venta</div>

          <div className="carrito-items">
            {carrito.length === 0 ? (
              <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '40px 0' }}>
                Seleccione productos del catálogo para agregarlos aquí.
              </p>
            ) : (
              carrito.map(item => (
                <div key={item.producto_id} className="carrito-item">
                  <div>
                    <div className="carrito-item-nombre">{item.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      Q {item.precio.toFixed(2)} c/u
                    </div>
                  </div>
                  <div className="carrito-item-cantidad">
                    <button onClick={() => cambiarCantidad(item.producto_id, -1)}>−</button>
                    <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>
                      {item.cantidad}
                    </span>
                    <button onClick={() => cambiarCantidad(item.producto_id, +1)}>+</button>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#4361EE', marginBottom: '4px' }}>
                      Q {(item.precio * item.cantidad).toFixed(2)}
                    </div>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontSize: '1rem' }}
                      onClick={() => eliminarDelCarrito(item.producto_id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '16px' }}>
            <div className="carrito-total">
              Total: Q {totalCarrito.toFixed(2)}
            </div>
            <button
              className="btn btn-verde"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              onClick={finalizarVenta}
              disabled={procesando || carrito.length === 0}
            >
              {procesando ? '⏳ Procesando...' : '✅ Finalizar Venta'}
            </button>
            {carrito.length > 0 && (
              <button
                className="btn"
                style={{ width: '100%', marginTop: '8px', background: '#F3F4F6', color: '#374151' }}
                onClick={() => setCarrito([])}
              >
                🗑️ Vaciar carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ventas
