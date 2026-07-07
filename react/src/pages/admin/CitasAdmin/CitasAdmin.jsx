import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './CitasAdmin.css'

function CitasAdmin() {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todas')
  const [fechaBusqueda, setFechaBusqueda] = useState('')

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const response = await citasAPI.getAll()
      const citasData = response?.data || response || []

      const citasOrdenadas = citasData.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`)
        const fechaB = new Date(`${b.fecha}T${b.hora}`)
        return fechaA - fechaB
      })

      setCitas(citasOrdenadas)
    } catch (err) {
      setError('Error al cargar las citas')
      console.error(err)
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
    return String(hora).substring(0, 5)
  }

  const citasFiltradas = citas.filter((cita) => {
    const cumpleEstado =
      filtroEstado === 'todas' || cita.estado === filtroEstado

    const cumpleFecha =
      !fechaBusqueda || String(cita.fecha).substring(0, 10) === fechaBusqueda

    return cumpleEstado && cumpleFecha
  })

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="citas-admin-container container">
          <div>Cargando citas...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="citas-admin-container container">
        <div className="admin-header-section">
          <h1>Gestión de Citas</h1>
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

        <div className="busqueda-fecha-citas">
          <label>Buscar por fecha:</label>

          <input
            type="date"
            className="input-buscar-fecha"
            value={fechaBusqueda}
            onChange={(e) => setFechaBusqueda(e.target.value)}
          />

          <button
            className="btn-limpiar-fecha"
            onClick={() => setFechaBusqueda('')}
          >
            Limpiar
          </button>

          <span className="resultado-fecha">
            Mostrando {citasFiltradas.length} de {citas.length} citas
          </span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="citas-table-container">
          <table className="citas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No hay citas con los filtros seleccionados
                  </td>
                </tr>
              ) : (
                citasFiltradas.map((cita) => (
                  <tr key={cita.idCita}>
                    <td>{cita.idCita}</td>
                    <td>{formatFecha(cita.fecha)}</td>
                    <td>{formatHora(cita.hora)}</td>
                    <td>
                      {cita.paciente?.nombre} {cita.paciente?.apellido}
                    </td>
                    <td>
                      {cita.medico?.nombre} {cita.medico?.apellido}
                    </td>
                    <td>{cita.motivo || 'Consulta médica'}</td>
                    <td>
                      <span className={`estado-badge estado-${cita.estado}`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default CitasAdmin