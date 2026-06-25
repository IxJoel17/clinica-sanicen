import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../../components/Header'
import { especialidadesAPI } from '../../../services/api'
import './Home.css'

function Home() {
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const especialidadesRef = useRef(null)

  useEffect(() => {
    cargarEspecialidades()
  }, [])

  const cargarEspecialidades = async () => {
    try {
      const data = await especialidadesAPI.getAll()
      setEspecialidades(data || [])
    } catch (error) {
      console.error('Error cargando especialidades:', error)
      setEspecialidades([])
    } finally {
      setLoading(false)
    }
  }

  const scrollToEspecialidades = (e) => {
    e.preventDefault()
    if (especialidadesRef.current) {
      especialidadesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <Header />
      <section className="hero">
        <h1>Tu Salud es Nuestra Prioridad</h1>
        <p>
          Somos una clínica privada que brinda servicios de imágenes, laboratorio
          y farmacia con la mejor tecnología para ti.
        </p>
        <button onClick={scrollToEspecialidades} className="btn-ver-especialidades">
          Ver Nuestras Especialidades
          <span className="arrow-down">↓</span>
        </button>
      </section>

      <section ref={especialidadesRef} id="especialidades" className="especialidades-section">
        <div className="container">
          <div className="especialidades-header">
            <h2>Nuestras Especialidades</h2>
            <p>Contamos con profesionales altamente capacitados en diversas áreas médicas</p>
          </div>

          {loading ? (
            <div className="loading-especialidades">
              <div className="spinner"></div>
              <p>Cargando especialidades...</p>
            </div>
          ) : especialidades.length === 0 ? (
            <div className="no-especialidades">
              <p>No hay especialidades disponibles en este momento.</p>
            </div>
          ) : (
            <div className="especialidades-grid">
              {especialidades.map((especialidad) => (
                <div key={especialidad.idEspecialidad} className="especialidad-card">
                  <div className="especialidad-icon">
                    {getEspecialidadIcon(especialidad.nombre)}
                  </div>
                  <h3>{especialidad.nombre}</h3>
                  <p>{especialidad.descripcion || 'Atención especializada con los más altos estándares de calidad.'}</p>
                  <Link to="/login" className="especialidad-link">
                    Agendar Cita
                    <span className="arrow">→</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// Función para obtener iconos según la especialidad
function getEspecialidadIcon(nombre) {
  const iconos = {
    'Cardiología': '❤️',
    'Psicología': '🧠',
    'Pediatría': '👶',
    'Medicina Interna': '🫀',
    'Dermatología': '👤',
    'Neurología': '🧠',
    'Ginecología': '👩',
    'Traumatología': '🦴',
    'Oftalmología': '👁️',
    'Otorrinolaringología': '👂',
    'Prótesis': '🦾',
    'TAC 3D': '',
    'Cirugia Oral':'',
    'Implantología':'',
    'Medicina general': '',

  }

  for (const [key, icon] of Object.entries(iconos)) {
    if (nombre.toLowerCase().includes(key.toLowerCase())) {
      return icon
    }
  }

  return '🏥'
}

export default Home
