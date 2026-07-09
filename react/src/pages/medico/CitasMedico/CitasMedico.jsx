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
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  useEffect(() => {
    if (user?.correo) cargarCitas()
  }, [user])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const medico = await medicosAPI.getByCorreo(user.correo)
      setMedicoInfo(medico)

      if (medico.idMedico) {
        const citasData = await citasAPI.getByMedico(medico.idMedico)
        const citasArray = citasData?.citas || citasData || []

        const citasOrdenadas = citasArray.sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`)
          const fechaB = new Date(`${b.fecha}T${b.hora}`)
          return fechaA - fechaB
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

  const [year, month, day] = String(fecha).split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return date.toLocaleDateString('es-ES', {
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

  const normalizar = (texto) =>
    String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const citasFiltradas = citas.filter((cita) => {
  const cumpleEstado = filtroEstado === 'todas' || cita.estado === filtroEstado

  const fecha = new Date(cita.fecha)
  fecha.setHours(0, 0, 0, 0)

  let cumpleDesde = true
  let cumpleHasta = true

  if (fechaDesde) {
    const desde = new Date(fechaDesde)
    desde.setHours(0, 0, 0, 0)
    cumpleDesde = fecha >= desde
  }

  if (fechaHasta) {
    const hasta = new Date(fechaHasta)
    hasta.setHours(23, 59, 59, 999)
    cumpleHasta = fecha <= hasta
  }

  return cumpleEstado && cumpleDesde && cumpleHasta
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

        <div className="busqueda-citas-medico">
        <div>
          <label>Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div>
          <label>Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setFechaDesde('')
            setFechaHasta('')
          }}
        >
          Limpiar
        </button>
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

        {error && <div className="error-message">{error}</div>}

        <div className="resultado-busqueda-medico">
          Mostrando {citasFiltradas.length} de {citas.length} citas
        </div>

        {citasFiltradas.length === 0 ? (
          <div className="no-citas">
            <div className="no-citas-icon">📅</div>
            <h3>No hay citas encontradas</h3>
            <p>Prueba con otro paciente, DNI, fecha, estado o motivo.</p>
          </div>
        ) : (
          <div className="citas-list-medico">
            {citasFiltradas.map((cita) => (
              <div key={cita.idCita} className="cita-card-medico">
                <div className="cita-card-header-medico">
                  <div className="cita-fecha-badge-medico">
                    <span className="cita-dia">
                      {formatFecha(cita.fecha).split(',')[0]}
                    </span>
                    <span className="cita-fecha-num">
                      {String(cita.fecha).split('-')[2]}
                    </span>
                    <span className="cita-mes">
                      {formatFecha(cita.fecha).split(' de ')[1]?.substring(0, 3)}
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
                        {cita.paciente.dni && <small>DNI: {cita.paciente.dni}</small>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="cita-card-footer-medico">
                  <Link
                    to={`/medico/citas/${cita.idCita}`}
                    className={
                      cita.estado === 'programada' || cita.estado === 'pendiente'
                        ? 'btn-confirmar-cita-medico'
                        : 'btn-ver-detalle-medico'
                    }
                  >
                    {cita.estado === 'programada' || cita.estado === 'pendiente'
                      ? 'Ver Detalle y Confirmar'
                      : 'Ver Detalle'}
                  </Link>
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