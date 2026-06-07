import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isMedico, isAdministrador, isPaciente } from '../../utils/roles'
import './Sidebar.css'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 style={{ color: '#e8505b' }}>
          CLINICA <span style={{ color: '#2d9cdb' }}>SANICEN</span>
        </h2>
      </div>

      {user && (
        <div style={{ padding: '10px 20px', fontSize: '0.9em', color: 'white', borderBottom: '1px solid #eee' }}>
          {user.nombre} {user.apellido}
          <div style={{ fontSize: '0.85em', color: 'white', marginTop: '3px' }}>
            {user.rol}
          </div>
        </div>
      )}

      <ul className="menu-items">
        {/* Menú para Administrador */}
        {user && isAdministrador(user) && (
          <>
            <li>
              <Link to="/portal-admin" className={isActive('/portal-admin') ? 'active' : ''}>
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link to="/admin/medicos" className={isActive('/admin/medicos') ? 'active' : ''}>
                👨‍⚕️ Médicos
              </Link>
            </li>
            <li>
              <Link to="/admin/pacientes" className={isActive('/admin/pacientes') ? 'active' : ''}>
                👥 Pacientes
              </Link>
            </li>
            <li>
              <Link to="/admin/usuarios" className={isActive('/admin/usuarios') ? 'active' : ''}>
                👤 Usuarios
              </Link>
            </li>
            <li>
              <Link to="/admin/citas" className={isActive('/admin/citas') ? 'active' : ''}>
                📅 Citas
              </Link>
            </li>
            <li>
              <Link to="/admin/servicios" className={isActive('/admin/servicios') ? 'active' : ''}>
                📈 Servicios
              </Link>
            </li>
          </>
        )}

        {/* Menú para Recepcionista */}
        {user && user.rol?.toLowerCase() === 'recepcionista' && (
          <>
            <li>
              <Link to="/portal-recepcionista" className={isActive('/portal-recepcionista') ? 'active' : ''}>
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link to="/recepcionista/medicos" className={isActive('/recepcionista/medicos') ? 'active' : ''}>
                👨‍⚕️ Médicos
              </Link>
              </li>
            <li>
              <Link to="/recepcionista/pacientes" className={isActive('/recepcionista/pacientes') ? 'active' : ''}>
                👥 Pacientes
              </Link>
            </li>
            <li>
              <Link to="/recepcionista/citas" className={isActive('/recepcionista/citas') ? 'active' : ''}>
                📅 Citas
              </Link>
            </li>
            <li>
              <Link to="/recepcionista/pagos" className={isActive('/recepcionista/pagos') ? 'active' : ''}>
                💳 Pagos
              </Link>
            </li>
            <li>
              <Link to="/recepcionista/boletas" className={isActive('/recepcionista/boletas') ? 'active' : ''}>
                🧾 Boletas
              </Link>
            </li>
          </>
        )}
        {/* Menú para Médico */}
        {user && isMedico(user) && (
          <>
            <li>
              <Link to="/portal-medico" className={isActive('/portal-medico') ? 'active' : ''}>
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link to="/medico/citas" className={isActive('/medico/citas') ? 'active' : ''}>
                📅 Mis Citas
              </Link>
            </li>
            <li>
              <Link to="/medico/pacientes" className={isActive('/medico/pacientes') ? 'active' : ''}>
                👥 Mis Pacientes
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={isActive('/perfil') ? 'active-profile' : ''}>
                👤 Perfil
              </Link>
            </li>
          </>
        )}

        {/* Menú para Paciente */}
        {user && isPaciente(user) && (
          <>
            <li>
              <Link to="/portal" className={isActive('/portal') ? 'active' : ''}>
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link to="/citas" className={isActive('/citas') ? 'active-citas' : ''}>
                ⏰ Cita
              </Link>
            </li>
            <li>
              <Link to="/perfil" className={isActive('/perfil') ? 'active-profile' : ''}>
                👤 Perfil
              </Link>
            </li>
            <li>
              <Link to="/tratamiento" className={isActive('/tratamiento') ? 'active-tratamiento' : ''}>
                ⚙️ Tratamiento
              </Link>
            </li>
            <li>
              <Link to="/registro-medico">
                📄 Registro Médico
              </Link>
            </li>
            <li>
              <Link to="/receta-electronica">
                💊 Receta Electrónica
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            textDecoration: 'none',
            padding: 0,
            font: 'inherit',
          }}
        >
          ⬅ Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default Sidebar
