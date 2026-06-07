import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { isMedico, isAdministrador } from '../../../utils/roles'
import { citasAPI, historialAPI, recetasAPI, boletasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './Portal.css'

function Portal() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirigir según el rol del usuario
  useEffect(() => {
    if (user) {
      if (isMedico(user)) {
        navigate('/portal-medico', { replace: true })
      } else if (isAdministrador(user)) {
        navigate('/portal-admin', { replace: true })
      }
      // Si es paciente, se queda en este portal
    }
  }, [user, navigate])
  const [stats, setStats] = useState({
    citasPendientes: 0,
    tratamientosActivos: 0,
    recetasActivas: 0,
    ultimaCita: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    if (user?.idUsuario) {
      cargarEstadisticas()
    }
  }, [user, navigate])

  const cargarEstadisticas = async () => {
    setLoading(true)
    try {
      const idPaciente = user.idUsuario

      // Cargar datos en paralelo
      const [citasData, historialesData, recetasData] = await Promise.all([
        citasAPI.getByPaciente(idPaciente).catch(() => ({ citas: [] })),
        historialAPI.getAllByPaciente(idPaciente).catch(() => []),
        recetasAPI.getByPaciente(idPaciente).catch(() => []),
      ])

      const citas = citasData.citas || []
      const citasPendientes = citas.filter(
        (c) => c.estado === 'programada' || c.estado === 'pendiente'
      )

      // Obtener la próxima cita (más próxima en el futuro)
      const fechaActual = new Date()
      const proximaCita =
        citasPendientes.length > 0
          ? citasPendientes
              .filter((c) => {
                const fechaCita = new Date(`${c.fecha}T${c.hora}`)
                return fechaCita >= fechaActual
              })
              .sort((a, b) => {
                const fechaA = new Date(`${a.fecha}T${a.hora}`)
                const fechaB = new Date(`${b.fecha}T${b.hora}`)
                return fechaA - fechaB // Más próxima primero
              })[0] || citasPendientes.sort((a, b) => {
                const fechaA = new Date(`${a.fecha}T${a.hora}`)
                const fechaB = new Date(`${b.fecha}T${b.hora}`)
                return fechaB - fechaA // Más reciente si no hay futuras
              })[0]
          : null

      setStats({
        citasPendientes: citasPendientes.length,
        tratamientosActivos: historialesData.length || 0,
        recetasActivas: recetasData.length || 0,
        ultimaCita: proximaCita,
      })
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <LayoutWithSidebar showTopHeader={true} topHeaderText='"tu portal tu salud"'>
        <div className="dashboard-grid">
          <div>Cargando...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar showTopHeader={true} topHeaderText='"tu portal tu salud"'>
      {user && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Bienvenido, {user.nombre} {user.apellido}</h3>
          {stats.ultimaCita && (
            <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
              Próxima cita: {new Date(stats.ultimaCita.fecha).toLocaleDateString('es-ES')} a las{' '}
              {stats.ultimaCita.hora?.substring(0, 5)}
            </p>
          )}
        </div>
      )}

      <div className="dashboard-grid">
        <Link to="/perfil" className="card-option">
          <div className="card-icon">👤</div>
          <div className="card-text">perfil</div>
        </Link>

        <Link to="/citas" className="card-option">
          <div className="card-icon">🕒</div>
          <div className="card-text">
            cita
            {stats.citasPendientes > 0 && (
              <span style={{ marginLeft: '5px', color: '#E8505B' }}>
                ({stats.citasPendientes})
              </span>
            )}
          </div>
        </Link>

        <Link to="/registro-medico" className="card-option">
          <div className="card-icon">📄</div>
          <div className="card-text">
            registro medico
            {stats.tratamientosActivos > 0 && (
              <span style={{ marginLeft: '5px', color: '#E8505B' }}>
                ({stats.tratamientosActivos})
              </span>
            )}
          </div>
        </Link>

        <Link to="/receta-electronica" className="card-option">
          <div className="card-icon">💊</div>
          <div className="card-text">
            receta electronica
            {stats.recetasActivas > 0 && (
              <span style={{ marginLeft: '5px', color: '#E8505B' }}>
                ({stats.recetasActivas})
              </span>
            )}
          </div>
        </Link>

        <Link to="/tratamiento" className="card-option">
          <div className="card-icon">⚙️</div>
          <div className="card-text">tratamiento</div>
        </Link>
      </div>
    </LayoutWithSidebar>
  )
}

export default Portal
