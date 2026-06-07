import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { medicosAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './CitasMedico.css'

function CitasMedico() {
  const { user } = useAuth()
  const [medicoInfo, setMedicoInfo] = useState(null)
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todas')

  useEffect(() => {
    if (user?.correo) {
      cargarCitas()
    }
  }, [user])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      // Buscar el médico por correo
      const medico = await medicosAPI.getByCorreo(user.correo)
      setMedicoInfo(medico)

      // Cargar citas del médico ordenadas (más reciente a más lejana)
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
      console.error('Error cargando citas:', err)
      setError('Error al cargar las citas')
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return hora.substring(0, 5)
  }

  const citasFiltradas = citas.filter((cita) => {
    if (filtroEstado === 'todas') return true
    return cita.estado === filtroEstado
  })

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="citas-medico-container container">
          <div>Cargando citas...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="citas-medico-container container">
        <div className="citas-medico-header">
          <h1>Mis Citas Médicas</h1>
          {medicoInfo && (
            <p className="medico-nombre">
              {medicoInfo.nombre} {medicoInfo.apellido}
              {medicoInfo.especialidad && ` - ${medicoInfo.especialidad.nombre}`}
            </p>
          )}
        </div>

        <div className="filtros-citas">
          <button
            className={`filtro-btn ${filtroEstado === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('todas')}
          >
            Todas ({citas.length})
          </button>
          <button
            className={`filtro-btn ${filtroEstado === 'programada' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('programada')}
          >
            Programadas ({citas.filter((c) => c.estado === 'programada').length})
          </button>
          <button
            className={`filtro-btn ${filtroEstado === 'confirmada' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('confirmada')}
          >
            Confirmadas ({citas.filter((c) => c.estado === 'confirmada').length})
          </button>
          <button
            className={`filtro-btn ${filtroEstado === 'completada' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('completada')}
          >
            Completadas ({citas.filter((c) => c.estado === 'completada').length})
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {citasFiltradas.length === 0 ? (
          <div className="no-citas">
            <div className="no-citas-icon">📅</div>
            <h3>No hay citas {filtroEstado !== 'todas' ? filtroEstado : ''}</h3>
            <p>No tienes citas en este momento.</p>
          </div>
        ) : (
          <div className="citas-list-medico">
            {citasFiltradas.map((cita) => (
              <div key={cita.idCita} className="cita-card-medico">
                <div className="cita-card-header-medico">
                  <div className="cita-fecha-badge-medico">
                    <span className="cita-dia">{formatFecha(cita.fecha).split(',')[0]}</span>
                    <span className="cita-fecha-num">{new Date(cita.fecha).getDate()}</span>
                    <span className="cita-mes">
                      {new Date(cita.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                  </div>
                  <div className="cita-info-header-medico">
                    <h3>{cita.motivo || 'Consulta médica'}</h3>
                    <span className={`cita-estado-badge-medico estado-${cita.estado}`}>
                      {cita.estado}
                    </span>
                  </div>
                </div>

                <div className="cita-card-body-medico">
                  <div className="cita-detalle-medico">
                    <span className="cita-icon">🕐</span>
                    <div>
                      <strong>Hora:</strong>
                      <p>{formatHora(cita.hora)}</p>
                    </div>
                  </div>

                  {cita.paciente && (
                    <div className="cita-detalle-medico">
                      <span className="cita-icon">👤</span>
                      <div>
                        <strong>Paciente:</strong>
                        <p>
                          {cita.paciente.nombre} {cita.paciente.apellido}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="cita-card-footer-medico">
                  {(cita.estado === 'programada' || cita.estado === 'pendiente') && (
                    <Link
                      to={`/medico/citas/${cita.idCita}`}
                      className="btn-confirmar-cita-medico"
                    >
                      Ver Detalle y Confirmar
                    </Link>
                  )}
                  {cita.estado === 'confirmada' && (
                    <Link
                      to={`/medico/citas/${cita.idCita}`}
                      className="btn-ver-detalle-medico"
                    >
                      Ver Detalle
                    </Link>
                  )}
                  {cita.estado === 'completada' && (
                    <Link
                      to={`/medico/citas/${cita.idCita}`}
                      className="btn-ver-detalle-medico"
                    >
                      Ver Detalle
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default CitasMedico

