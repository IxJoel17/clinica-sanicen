import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { citasAPI, usuariosAPI } from '../../../services/api'
import '../../../styles/common.css'
import './PortalRecepcionista.css'

function PortalRecepcionista() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMedicos: 0,
    totalPacientes: 0,
    totalUsuarios: 0,
    totalCitas: 0,
    citasRecientes: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    setLoading(true)
    try {
      const [medicosRes, pacientesRes, usuariosRes, citasRes] = await Promise.all([
        medicosAPI.getAll().catch(() => ({ data: [] })),
        pacientesAPI.getAll().catch(() => ({ data: [] })),
        usuariosAPI.getAll().catch(() => ({ data: [] })),
        citasAPI.getAll().catch(() => ({ data: [] })),
      ])

      const medicosData = medicosRes?.data || medicosRes || []
      const pacientesData = pacientesRes?.data || pacientesRes || []
      const usuariosData = usuariosRes?.data || usuariosRes || []
      const citasData = citasRes?.data || citasRes || []

      // Filtrar solo citas programadas y ordenar por fecha (más próximas primero)
      const fechaActual = new Date()
      const citasProgramadas = citasData
        .filter((cita) => cita.estado === 'programada' || cita.estado === 'pendiente')
        .sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`)
          const fechaB = new Date(`${b.fecha}T${b.hora}`)
          // Ordenar de más próxima a menos próxima (ascendente)
          return fechaA - fechaB
        })
        .slice(0, 10) // Solo las 10 más próximas

      setStats({
        totalMedicos: medicosData.length || 0,
        totalPacientes: pacientesData.length || 0,
        totalUsuarios: usuariosData.length || 0,
        totalCitas: citasData.length || 0,
        citasRecientes: citasProgramadas,
      })
    } catch (err) {
      console.error('Error cargando estadísticas:', err)

      setStats({
        citasHoy: 0,
        totalPacientes: 0,
        pagosPendientes: 0,
        boletasEmitidas: 0,
        citasRecientes: [],
      })
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

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="portal-admin-container container">
          <div>Cargando estadísticas...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="portal-admin-container container">
        <div className="admin-header">
          <h1>Panel de Recepción</h1>
          {user && (
            <p className="admin-welcome">
              Bienvenido, <strong>{user.nombre} {user.apellido}</strong>
            </p>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Estadísticas Generales */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.citasHoy}</h3>
              <p>Citas del día</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalPacientes}</h3>
              <p>Pacientes registrados</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <h3>{stats.pagosPendientes}</h3>
              <p>pagos pendientes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div className="stat-content">
              <h3>{stats.totalCitas}</h3>
              <p>boletas emitidas</p>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="admin-actions">
            <h2>Gestión de Recepción</h2>
            <div className="actions-grid">

    <Link to="/recepcionista/pacientes" className="action-card-admin">
            <div className="action-icon-admin">👥</div>
        <div className="action-text-admin">
        <h3>Pacientes</h3>
        <p>Registrar, buscar y actualizar pacientes</p>
            </div>
    </Link>

    <Link to="/recepcionista/citas" className="action-card-admin">
        <div className="action-icon-admin">📅</div>
        <div className="action-text-admin">
        <h3>Citas</h3>
        <p>Programar y consultar citas médicas</p>
        </div>
    </Link>

    <Link to="/recepcionista/pagos" className="action-card-admin">
        <div className="action-icon-admin">💳</div>
        <div className="action-text-admin">
        <h3>Pagos</h3>
        <p>Registrar pagos de consultas</p>
        </div>
    </Link>

    <Link to="/recepcionista/boletas" className="action-card-admin">
        <div className="action-icon-admin">🧾</div>
        <div className="action-text-admin">
        <h3>Boletas</h3>
        <p>Emitir y consultar boletas</p>
        </div>
        </Link>

    </div>
</div>

        {/* Citas Próximas */}
        {stats.citasRecientes.length > 0 && (
          <div className="citas-recientes-section">
            <h2>Citas Programadas Próximas</h2>
            <div className="citas-recientes-table">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.citasRecientes.map((cita) => (
                    <tr key={cita.idCita}>
                      <td>{formatFecha(cita.fecha)}</td>
                      <td>{formatHora(cita.hora)}</td>
                      <td>
                        {cita.paciente?.nombre} {cita.paciente?.apellido}
                      </td>
                      <td>
                        {cita.medico?.nombre} {cita.medico?.apellido}
                      </td>
                      <td>
                        <span className={`estado-badge-admin estado-${cita.estado}`}>
                          {cita.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default PortalRecepcionista

  