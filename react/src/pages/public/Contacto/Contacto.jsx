import Header from '../../../components/Header'
import './Contacto.css'

function Contacto() {
  return (
    <>
      <Header />
      <div className="contacto-section">
        <h2>Contáctanos Hoy</h2>
        <div className="info-card">
          <h3>☎️ Teléfono de Contacto Principal</h3>
          <p>994340970</p>
          <a href="tel:994340970">Llamar Ahora</a>
        </div>
        <div className="nota-atencion">
          <strong>Horario de Atención:</strong> Lunes a Viernes de 8:00 a.m. a 6:00 p.m. y Sábados
          de 8:00 a.m. a 12:00 p.m.
        </div>
      </div>
    </>
  )
}

export default Contacto

