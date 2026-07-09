import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { medicosAPI, pacientesAPI, citasAPI, usuariosAPI } from '../../../services/api'
import '../../../styles/common.css'
import './PortalAdmin.css'

function PortalAdmin() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMedicos: 0,
    totalPacientes: 0,
    totalUsuarios: 0,
    totalCitas: 0,
    citasRecientes: [],
  })

  const [medicos, setMedicos] = useState([])
  const [medicoReporte, setMedicoReporte] = useState('')
  const [fechaDesde, setFechaDesde] = useState('2026-07-08')
  const [fechaHasta, setFechaHasta] = useState('2026-07-31')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    setLoading(true)

    try {
      const [medicosRes, pacientesRes, usuariosRes, citasRes] = await Promise.all([
        medicosAPI.getAll().catch(() => []),
        pacientesAPI.getAll().catch(() => []),
        usuariosAPI.getAll().catch(() => []),
        citasAPI.getAll().catch(() => []),
      ])

      const medicosData = medicosRes?.data || medicosRes || []
      const pacientesData = pacientesRes?.data || pacientesRes || []
      const usuariosData = usuariosRes?.data || usuariosRes || []
      const citasData = citasRes?.data || citasRes || []

      setMedicos(medicosData)

      if (medicosData.length > 0) {
        setMedicoReporte(medicosData[0].idMedico)
      }

      const citasProgramadas = citasData
        .filter((cita) => cita.estado === 'programada' || cita.estado === 'pendiente')
        .sort((a, b) => {
          const fechaA = new Date(`${a.fecha}T${a.hora}`)
          const fechaB = new Date(`${b.fecha}T${b.hora}`)
          return fechaA - fechaB
        })
        .slice(0, 10)

      setStats({
        totalMedicos: medicosData.length || 0,
        totalPacientes: pacientesData.length || 0,
        totalUsuarios: usuariosData.length || 0,
        totalCitas: citasData.length || 0,
        citasRecientes: citasProgramadas,
      })
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
      setError('Error al cargar las estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''

    const [year, month, day] = String(fecha).split('-')
    const date = new Date(Number(year), Number(month) - 1, Number(day))

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return String(hora).substring(0, 5)
  }

  const abrirReporteEstadistico = () => {
    window.open('http://localhost:8080/api/reportes/admin/estadisticas/pdf', '_blank')
  }

  const abrirReporteCitas = () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Seleccione fecha desde y hasta')
      return
    }

    window.open(
      `http://localhost:8080/api/reportes/citas-rango/pdf?desde=${fechaDesde}&hasta=${fechaHasta}`,
      '_blank'
    )
  }

  const abrirReportePacientesMedico = () => {
    if (!medicoReporte) {
      alert('Seleccione un médico')
      return
    }

    window.open(
      `http://localhost:8080/api/reportes/pacientes-medico/${medicoReporte}/pdf`,
      '_blank'
    )
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
          <h1>Panel de Administración</h1>

          {user && (
            <p className="admin-welcome">
              Bienvenido, <strong>{user.nombre} {user.apellido}</strong>
            </p>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👨‍⚕️</div>
            <div className="stat-content">
              <h3>{stats.totalMedicos}</h3>
              <p>Médicos Activos</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalPacientes}</h3>
              <p>Pacientes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <h3>{stats.totalUsuarios}</h3>
              <p>Usuarios del Sistema</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.totalCitas}</h3>
              <p>Total de Citas</p>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <h2>Gestión del Sistema</h2>

          <div className="actions-grid">
            <Link to="/admin/medicos" className="action-card-admin">
              <div className="action-icon-admin">👨‍⚕️</div>
              <div className="action-text-admin">
                <h3>Médicos</h3>
                <p>Gestionar médicos y especialidades</p>
              </div>
            </Link>

            <Link to="/admin/pacientes" className="action-card-admin">
              <div className="action-icon-admin">👥</div>
              <div className="action-text-admin">
                <h3>Pacientes</h3>
                <p>Ver y gestionar pacientes</p>
              </div>
            </Link>

            <Link to="/admin/citas" className="action-card-admin">
              <div className="action-icon-admin">📅</div>
              <div className="action-text-admin">
                <h3>Citas</h3>
                <p>Ver todas las citas del sistema</p>
              </div>
            </Link>

            <Link to="/admin/usuarios" className="action-card-admin">
              <div className="action-icon-admin">👤</div>
              <div className="action-text-admin">
                <h3>Usuarios</h3>
                <p>Gestionar usuarios y permisos</p>
              </div>
            </Link>

            <Link to="/admin/servicios" className="action-card-admin">
              <div className="action-icon-admin">📈</div>
              <div className="action-text-admin">
                <h3>Servicios</h3>
                <p>Gestionar servicios y especialidades</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="admin-reportes">
          <h2>📑 Reportes del Sistema</h2>

          <div className="reportes-grid">
            <div className="reporte-card-admin">
              <h3>📊 Reporte Estadístico</h3>
              <p>Resumen general del sistema, citas, boletas e ingresos.</p>
              <button className="reporte-btn" onClick={abrirReporteEstadistico}>
                Generar PDF
              </button>
            </div>

            <div className="reporte-card-admin">
              <h3>📅 Reporte de Citas</h3>
              <p>Reporte de citas por rango de fechas.</p>

              <div className="reporte-fechas">
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
              </div>

              <button className="reporte-btn" onClick={abrirReporteCitas}>
                Generar PDF
              </button>
            </div>

            <div className="reporte-card-admin">
              <h3>👨‍⚕️ Pacientes por Médico</h3>
              <p>Lista de pacientes atendidos por un médico seleccionado.</p>

              <select
                className="select-reporte-medico"
                value={medicoReporte}
                onChange={(e) => setMedicoReporte(e.target.value)}
              >
                {medicos.map((medico) => (
                  <option key={medico.idMedico} value={medico.idMedico}>
                    {medico.nombre} {medico.apellido}
                  </option>
                ))}
              </select>

              <button className="reporte-btn" onClick={abrirReportePacientesMedico}>
                Generar PDF
              </button>
            </div>
          </div>
        </div>

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

export default PortalAdmin