import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { historialAPI, pacientesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './Tratamiento.css'

function Tratamiento() {
  const { user } = useAuth()
  const [historiales, setHistoriales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_REPORTES = 'http://localhost:8080/api/reportes/tratamientos'

  useEffect(() => {
    if (user?.correo) {
      cargarHistoriales()
    }
  }, [user])

  const cargarHistoriales = async () => {
    setLoading(true)
    try {
      let idPaciente = null

      if (user?.correo) {
        try {
          const paciente = await pacientesAPI.getByCorreo(user.correo)
          idPaciente = paciente.idPaciente
        } catch {
          setHistoriales([])
          return
        }
      }

      if (!idPaciente) {
        setHistoriales([])
        return
      }

      const historialesData = await historialAPI.getAllByPaciente(idPaciente)
      const historialesArray = historialesData?.data || historialesData || []

      const historialesOrdenados = historialesArray.sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro || a.fechaCreacion || 0)
        const fechaB = new Date(b.fechaRegistro || b.fechaCreacion || 0)
        return fechaB - fechaA
      })

      setHistoriales(historialesOrdenados)
    } catch (err) {
      console.error('Error cargando historiales:', err)
      setError('Error al cargar los tratamientos')
      setHistoriales([])
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const imprimirPDF = (idHistorial) => {
    window.open(`${API_REPORTES}/${idHistorial}/pdf`, '_blank')
  }

  const descargarPDF = (idHistorial) => {
    const link = document.createElement('a')
    link.href = `${API_REPORTES}/${idHistorial}/pdf`
    link.download = `tratamiento_${idHistorial}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="tratamiento-container container">
          <div>Cargando tratamientos...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="tratamiento-container container">
        <div className="header-tratamiento">Tratamientos y Terapias en Curso</div>

        {error && (
          <div style={{ color: '#E8505B', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        {historiales.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No hay tratamientos registrados
          </div>
        ) : (
          historiales.map((historial, index) => (
            <div key={historial.idHistorial || index} className="tratamiento-card">
              <span className="status-badge">ACTIVO</span>

              <h3>{historial.diagnostico || 'Tratamiento Médico'}</h3>

              <div className="meta-info">
                <span>
                  Especialista: {historial.medico?.nombre} {historial.medico?.apellido}
                </span>
                <span>Iniciado: {formatFecha(historial.fechaRegistro)}</span>
              </div>

              <div className="indicaciones">
                <h4>Diagnóstico:</h4>
                <p>{historial.diagnostico || 'No especificado'}</p>

                <h4>Tratamiento:</h4>
                <ul>
                  <li>{historial.tratamiento || 'No hay tratamiento especificado'}</li>
                </ul>

                {historial.observaciones && (
                  <>
                    <h4>Observaciones:</h4>
                    <p>{historial.observaciones}</p>
                  </>
                )}
              </div>

              <div className="acciones-tratamiento">
                <button
                  type="button"
                  className="btn-imprimir-tratamiento"
                  onClick={() => imprimirPDF(historial.idHistorial)}
                >
                  🖨️ Imprimir
                </button>

                <button
                  type="button"
                  className="btn-descargar-tratamiento"
                  onClick={() => descargarPDF(historial.idHistorial)}
                >
                  ⬇️ Descargar PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default Tratamiento