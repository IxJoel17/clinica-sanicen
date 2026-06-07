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

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const response = await citasAPI.getAll()
      const citasData = response?.data || response || []
      // Ordenar por fecha (más próximas primero - ascendente)
      const citasOrdenadas = citasData.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`)
        const fechaB = new Date(`${b.fecha}T${b.hora}`)
        // Ordenar de más próxima a menos próxima
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
    return hora.substring(0, 5)
  }

  const citasFiltradas = citas.filter((cita) => {
    if (filtroEstado === 'todas') return true
    return cita.estado === filtroEstado
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
                    No hay citas {filtroEstado !== 'todas' ? filtroEstado : ''}
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

