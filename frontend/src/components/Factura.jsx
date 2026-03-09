// Componente de Factura — modal que se muestra al finalizar la venta
function Factura({ datos, onCerrar }) {
  if (!datos) return null

  const { venta_id, fecha, total, items } = datos

  const fechaFormateada = fecha
    ? new Date(fecha).toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })

  const handleImprimir = () => {
    window.print()
  }

  return (
    <>
      {/* Estilos de impresión */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .factura-print-area { display: block !important; }
          .factura-overlay { position: static !important; background: none !important; }
          .factura-modal {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .factura-botones { display: none !important; }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="factura-print-area"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
      >
        {/* Modal de factura */}
        <div
          className="factura-modal"
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '520px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {/* Encabezado */}
          <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '2px solid #4361EE', paddingBottom: '20px' }}>
            <img
              src="/logo.png.jpeg"
              alt="Logo Arcoiris"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid #4361EE' }}
            />
            <h2 style={{ margin: '0 0 4px', color: '#4361EE', fontSize: '1.3rem', fontWeight: '800' }}>
              Piñatería y Papelería Arcoiris
            </h2>
            <p style={{ margin: '2px 0', color: '#6B7280', fontSize: '0.82rem' }}>NIT: 000.000.000-0</p>
            <p style={{ margin: '2px 0', color: '#6B7280', fontSize: '0.82rem' }}>Dirección: Calle Principal #1-23, Colombia</p>
            <p style={{ margin: '2px 0', color: '#6B7280', fontSize: '0.82rem' }}>Teléfono: (601) 000-0000</p>
          </div>

          {/* Datos de la venta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.88rem' }}>
            <div>
              <div style={{ color: '#6B7280' }}>Nº Factura</div>
              <div style={{ fontWeight: '700', color: '#111827', fontSize: '1rem' }}>#{String(venta_id).padStart(6, '0')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#6B7280' }}>Fecha y Hora</div>
              <div style={{ fontWeight: '700', color: '#111827' }}>{fechaFormateada}</div>
            </div>
          </div>

          {/* Tabla de productos */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#4361EE', color: '#fff' }}>
                <th style={{ padding: '10px 8px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>Producto</th>
                <th style={{ padding: '10px 8px', textAlign: 'center' }}>Cant.</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>Precio Unit.</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#F9FAFB' : '#fff', borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '10px 8px', fontWeight: '600', color: '#111827' }}>{item.nombre}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', color: '#374151' }}>{item.cantidad}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', color: '#374151' }}>
                    $ {Number(item.precio).toLocaleString('es-CO')}
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700', color: '#4361EE' }}>
                    $ {Number(item.subtotal).toLocaleString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#EEF2FF',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '24px',
            borderLeft: '4px solid #4361EE'
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#374151' }}>TOTAL</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#4361EE' }}>
              $ {Number(total).toLocaleString('es-CO')}
            </span>
          </div>

          {/* Pie */}
          <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.88rem', marginBottom: '24px', fontStyle: 'italic' }}>
            ¡Gracias por su compra! 🌈
          </div>

          {/* Botones */}
          <div
            className="factura-botones"
            style={{ display: 'flex', gap: '12px' }}
          >
            <button
              onClick={handleImprimir}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#4361EE',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem'
              }}
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={onCerrar}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.95rem'
              }}
            >
              ✖ Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Factura
