import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { medicosAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './PortalMedico.css'

function PortalMedico() {
  const { user } = useAuth()
  const [medicoInfo, setMedicoInfo] = useState(null)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.correo) {
      cargarDatosMedico()
    }
  }, [user])

  const cargarDatosMedico = async () => {
    setLoading(true)
    try {
      const medico = await medicosAPI.getByCorreo(user.correo)
      setMedicoInfo(medico)

      if (medico.idMedico) {
        const citasData = await citasAPI.getByMedico(medico.idMedico)
        const citasOrdenadas = (citasData.citas || []).sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`)
          const fechaB = new Date(`${b.fecha}T${b.hora}`)
          return fechaA - fechaB // Más reciente primero
        })
        setCitas(citasOrdenadas)
      }
    } catch (err) {
      console.error('Error cargando datos del médico:', err)
      setError('Error al cargar los datos del médico')
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return hora.substring(0, 5)
  }

  const citasPendientes = citas.filter(
    (c) => c.estado === 'programada' || c.estado === 'pendiente'
  )

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="portal-medico-container container">
          <div>Cargando información del médico...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  if (error) {
    return (
      <LayoutWithSidebar>
        <div className="portal-medico-container container">
          <div className="error-message">{error}</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="portal-medico-container container">
        <div className="medico-header">
          <h1>Portal Médico</h1>
          {medicoInfo && (
            <div className="medico-info-card">
              <h2>
                {medicoInfo.nombre} {medicoInfo.apellido}
              </h2>
              {medicoInfo.especialidad && (
                <p className="especialidad">{medicoInfo.especialidad.nombre}</p>
              )}
              <p className="citas-pendientes">
                {citasPendientes.length} {citasPendientes.length === 1 ? 'cita pendiente' : 'citas pendientes'}
              </p>
            </div>
          )}
        </div>

        <div className="medico-actions">
          <Link to="/medico/citas" className="action-card">
            <div className="action-icon">📅</div>
            <div className="action-text">
              <h3>Mis Citas</h3>
              <p>Ver y gestionar mis citas programadas</p>
              {citasPendientes.length > 0 && (
                <span className="badge">{citasPendientes.length}</span>
              )}
            </div>
          </Link>

          <Link to="/medico/pacientes" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-text">
              <h3>Mis Pacientes</h3>
              <p>Ver historial de pacientes atendidos</p>
            </div>
          </Link>
        </div>

        {citasPendientes.length > 0 && (
          <div className="citas-proximas">
            <h3>Próximas Citas</h3>
            <div className="citas-list">
              {citasPendientes.slice(0, 5).map((cita) => (
                <Link
                  key={cita.idCita}
                  to={`/medico/citas/${cita.idCita}`}
                  className="cita-item"
                >
                  <div className="cita-fecha-hora">
                    <span className="cita-fecha">{formatFecha(cita.fecha)}</span>
                    <span className="cita-hora">{formatHora(cita.hora)}</span>
                  </div>
                  <div className="cita-info">
                    <span className="cita-paciente">
                      {cita.paciente?.nombre} {cita.paciente?.apellido}
                    </span>
                    <span className="cita-motivo">{cita.motivo || 'Consulta médica'}</span>
                  </div>
                  <span className={`cita-estado estado-${cita.estado}`}>
                    {cita.estado}
                  </span>
                </Link>
              ))}
            </div>
            {citasPendientes.length > 5 && (
              <Link to="/medico/citas" className="ver-todas">
                Ver todas las citas ({citasPendientes.length})
              </Link>
            )}
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default PortalMedico

