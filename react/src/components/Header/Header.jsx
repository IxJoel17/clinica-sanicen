import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import './Header.css'
import logoClinica from '../../assets/img/logo.png'  // Ruta del logo

function Header() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleEspecialidadesClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      // Si estamos en home, hacer scroll
      const especialidadesSection = document.getElementById('especialidades')
      if (especialidadesSection) {
        especialidadesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Si estamos en otra página, ir a home y luego hacer scroll
      navigate('/')
      setTimeout(() => {
        const especialidadesSection = document.getElementById('especialidades')
        if (especialidadesSection) {
          especialidadesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img 
            src={logoClinica} 
            alt="Clinica Sanicen"
            className="logo-img" 
          />
        </Link>
      </div>

      <nav>
        <a href="#especialidades" onClick={handleEspecialidadesClick}>
          Especialidades
        </a>
        <Link to="/Nosotros">Sobre nosotros</Link>
      </nav>

      <div className="header-buttons">
        <Link to="/login" className="btn-login">Iniciar Sesión</Link>
        <Link to="/contacto" className="btn-contact">Contáctanos</Link>
      </div>
    </header>
  )
}

export default Header
