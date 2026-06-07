import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { historialAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './DetalleRegistro.css'

function DetalleRegistro() {
  const [searchParams] = useSearchParams()
  const idHistorial = searchParams.get('id')
  const idCita = searchParams.get('citaId')
  const [registro, setRegistro] = useState(null)
  const [cita, setCita] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (idHistorial) {
      cargarHistorial()
    } else if (idCita) {
      cargarCita()
    } else {
      setError('No se proporcionó un ID válido')
      setLoading(false)
    }
  }, [idHistorial, idCita])

  const cargarHistorial = async () => {
    setLoading(true)
    try {
      // Si tenemos idHistorial, buscamos el historial específico
      // Por ahora, cargamos todos y buscamos el que coincide
      const historiales = await historialAPI.getAllByPaciente(1) // Necesitarías el idPaciente del usuario
      const historialEncontrado = historiales.find((h) => h.idHistorial === parseInt(idHistorial))
      
      if (historialEncontrado) {
        setRegistro(historialEncontrado)
      } else {
        setError('Registro médico no encontrado')
      }
    } catch (err) {
      console.error('Error cargando registro:', err)
      setError('Error al cargar el registro médico')
    } finally {
      setLoading(false)
    }
  }

  const cargarCita = async () => {
    setLoading(true)
    try {
      const citaData = await citasAPI.getById(idCita)
      setCita(citaData)
    } catch (err) {
      console.error('Error cargando cita:', err)
      setError('Error al cargar la cita')
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

  const formatHora = (hora) => {
    if (!hora) return ''
    const time = hora.substring(0, 5)
    const [hours, minutes] = time.split(':')
    const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours)
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-container container">
          <div>Cargando...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  if (error) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-container container">
          <div style={{ color: '#E8505B', padding: '20px' }}>{error}</div>
          <Link to="/registro-medico" className="btn-volver">
            Volver al Historial
          </Link>
        </div>
      </LayoutWithSidebar>
    )
  }

  // Renderizar historial médico
  if (registro) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-container container">
          <div className="header-detalle">
            Detalles del Registro Médico
          </div>

          <div className="seccion">
            <h3>Información General</h3>
            <p>
              <strong>Fecha:</strong> {formatFecha(registro.fechaRegistro)}
            </p>
            <p>
              <strong>Médico Tratante:</strong>{' '}
              {registro.medico?.nombre} {registro.medico?.apellido}
            </p>
          </div>

          <div className="seccion">
            <h3>Diagnóstico</h3>
            <p>
              <strong>Diagnóstico Principal:</strong>{' '}
              {registro.diagnostico || 'No especificado'}
            </p>
            {registro.observaciones && (
              <p>
                <strong>Observaciones:</strong> {registro.observaciones}
              </p>
            )}
          </div>

          <div className="seccion">
            <h3>Tratamiento e Indicaciones</h3>
            <p>
              <strong>Tratamiento:</strong>{' '}
              {registro.tratamiento || 'No especificado'}
            </p>
          </div>

          <Link to="/registro-medico" className="btn-volver">
            Volver al Historial
          </Link>
        </div>
      </LayoutWithSidebar>
    )
  }

  // Renderizar cita
  if (cita) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-container container">
          <div className="header-detalle">Detalles de la Cita</div>

          <div className="seccion">
            <h3>Información General</h3>
            <p>
              <strong>Fecha:</strong> {formatFecha(cita.fecha)}
            </p>
            <p>
              <strong>Hora:</strong> {formatHora(cita.hora)}
            </p>
            <p>
              <strong>Estado:</strong> {cita.estado}
            </p>
            <p>
              <strong>Médico:</strong> {cita.medico?.nombre} {cita.medico?.apellido}
            </p>
            {cita.medico?.especialidad && (
              <p>
                <strong>Especialidad:</strong> {cita.medico.especialidad}
              </p>
            )}
          </div>

          <div className="seccion">
            <h3>Detalles de la Consulta</h3>
            <p>
              <strong>Motivo:</strong> {cita.motivo || 'No especificado'}
            </p>
          </div>

          <Link to="/citas" className="btn-volver">
            Volver a Citas
          </Link>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="detalle-container container">
        <div>No se encontró información</div>
        <Link to="/portal" className="btn-volver">
          Volver al Portal
        </Link>
      </div>
    </LayoutWithSidebar>
  )
}

export default DetalleRegistro
