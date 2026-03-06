// Componente Card reutilizable para el dashboard
function Card({ titulo, valor, icono, color }) {
  return (
    <div className={`card card-${color}`}>
      <span className="card-icono">{icono}</span>
      <div className="card-titulo">{titulo}</div>
      <div className="card-valor">{valor}</div>
    </div>
  )
}

export default Card
