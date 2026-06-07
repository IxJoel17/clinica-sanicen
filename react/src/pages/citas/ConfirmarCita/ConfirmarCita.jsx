import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './ConfirmarCita.css'

function ConfirmarCita() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.idUsuario) {
      cargarCitasPendientes()
    }
  }, [user])

  const cargarCitasPendientes = async () => {
    setLoading(true)
    try {
      const response = await citasAPI.getByPaciente(user.idUsuario)
      // Filtrar solo citas pendientes/programadas
      const citasPendientes = (response.citas || []).filter(
        (cita) => cita.estado === 'programada' || cita.estado === 'pendiente'
      )
      setCitas(citasPendientes)
    } catch (err) {
      console.error('Error cargando citas:', err)
      setError('Error al cargar las citas')
      setCitas([])
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return hora.substring(0, 5)
  }

  const formatFechaCompleta = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <LayoutWithSidebar>
      <div className="confirmacion-container container">
        <div className="header-confirmacion">Mis Citas Programadas</div>

        <p style={{ marginBottom: '30px', color: '#666', fontSize: '1.1rem', textAlign: 'center' }}>
          Aquí puedes ver todas tus citas médicas programadas. El médico confirmará tu asistencia después de la consulta.
        </p>

        {error && (
          <div
            style={{
              color: '#E8505B',
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: '#ffe6e6',
              borderRadius: '8px',
              border: '1px solid #ffcccc',
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#666' }}>Cargando citas programadas...</p>
          </div>
        ) : citas.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              border: '2px dashed #dee2e6',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📅</div>
            <h3 style={{ color: '#495057', marginBottom: '10px' }}>No hay citas programadas</h3>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>
              No tienes citas programadas en este momento.
            </p>
            <Link to="/citas" className="btn-crear-cita">
              Agendar Nueva Cita
            </Link>
          </div>
        ) : (
          <div className="citas-pendientes-grid">
            {citas.map((cita) => (
              <div key={cita.idCita} className="cita-pendiente-card">
                <div className="cita-card-header">
                  <div className="cita-fecha-badge">
                    <span className="cita-dia">{formatFecha(cita.fecha).split('/')[0]}</span>
                    <span className="cita-mes">
                      {new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                  </div>
                  <div className="cita-info-header">
                    <h3>{cita.motivo || 'Consulta médica'}</h3>
                    <span className={`cita-estado-badge estado-${cita.estado}`}>
                      {cita.estado === 'programada' ? 'Programada' : cita.estado}
                    </span>
                  </div>
                </div>

                <div className="cita-card-body">
                  <div className="cita-detalle">
                    <span className="cita-detalle-icon">📅</span>
                    <div>
                      <strong>Fecha:</strong>
                      <p>{formatFechaCompleta(cita.fecha)}</p>
                    </div>
                  </div>

                  <div className="cita-detalle">
                    <span className="cita-detalle-icon">🕐</span>
                    <div>
                      <strong>Hora:</strong>
                      <p>{formatHora(cita.hora)}</p>
                    </div>
                  </div>

                  {cita.medico && (
                    <div className="cita-detalle">
                      <span className="cita-detalle-icon">👨‍⚕️</span>
                      <div>
                        <strong>Médico:</strong>
                        <p>
                          {cita.medico.nombre} {cita.medico.apellido}
                          {cita.medico.especialidad && (
                            <span style={{ color: '#6c757d', fontSize: '0.9em' }}>
                              {' '}
                              - {cita.medico.especialidad}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="cita-card-footer-info">
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d', fontStyle: 'italic' }}>
                    💡 Tu asistencia será confirmada por el médico después de la consulta.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/citas" className="btn-volver-citas">
            ← Volver a Agendar Citas
          </Link>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default ConfirmarCita
