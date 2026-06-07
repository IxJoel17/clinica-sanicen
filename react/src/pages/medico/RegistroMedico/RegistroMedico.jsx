import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { historialAPI, pacientesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './RegistroMedico.css'

function RegistroMedico() {
  const { user } = useAuth()
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.correo) {
      cargarRegistros()
    }
  }, [user])

  const cargarRegistros = async () => {
    setLoading(true)
    try {
      let idPaciente = null
      if (user?.correo) {
        try {
          const paciente = await pacientesAPI.getByCorreo(user.correo)
          idPaciente = paciente.idPaciente
        } catch (err) {
          console.log('Paciente no encontrado')
          setRegistros([])
          return
        }
      }

      if (!idPaciente) {
        setRegistros([])
        return
      }

      const historialesData = await historialAPI.getAllByPaciente(idPaciente)
      const registrosArray = historialesData?.data || historialesData || []
      const registrosOrdenados = registrosArray.sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro || a.fechaCreacion || 0)
        const fechaB = new Date(b.fechaRegistro || b.fechaCreacion || 0)
        return fechaB - fechaA
      })
      setRegistros(registrosOrdenados)
    } catch (err) {
      console.error('Error cargando registros:', err)
      setError('Error al cargar el historial médico')
      setRegistros([])
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="registro-container container">
          <div>Cargando historial médico...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="registro-container container">
        <div className="header-registro">HISTORIAL DE REGISTROS MÉDICOS</div>

        {error && (
          <div style={{ color: '#E8505B', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        {registros.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No hay registros médicos disponibles
          </div>
        ) : (
          <div className="historial-grid">
            {registros.map((registro) => (
              <div key={registro.idHistorial} className="registro-card">
                <h4>
                  {registro.diagnostico || 'Consulta Médica'}
                </h4>
                <div className="registro-meta">
                  <span>Fecha: {formatFecha(registro.fechaRegistro)}</span>
                  <span>
                    Médico: {registro.medico?.nombre} {registro.medico?.apellido}
                  </span>
                </div>
                <div className="registro-details">
                  <p>
                    <strong>Diagnóstico Principal:</strong>{' '}
                    {registro.diagnostico || 'No especificado'}
                  </p>
                  <p>
                    <strong>Tratamiento:</strong>{' '}
                    {registro.tratamiento || 'No especificado'}
                  </p>
                  {registro.observaciones && (
                    <p>
                      <strong>Observaciones:</strong> {registro.observaciones}
                    </p>
                  )}
                </div>
                <Link
                  to={`/detalle-registro?id=${registro.idHistorial}`}
                  className="btn-ver-detalles"
                >
                  Ver detalles
                </Link>
                <div style={{ clear: 'both' }}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default RegistroMedico
