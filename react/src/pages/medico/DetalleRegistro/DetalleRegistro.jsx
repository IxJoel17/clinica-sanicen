import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { historialAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './DetalleRegistro.css'

function DetalleRegistro() {
  const navigate = useNavigate()
  const location = useLocation()

  const [registro, setRegistro] = useState(null)
  const [cita, setCita] = useState(null)
  const [tipoVista, setTipoVista] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = new URLSearchParams(location.search)
  const idHistorial = params.get('id')
  const citaId = params.get('citaId')

  const API_HISTORIAL = 'http://localhost:8080/api/reportes/historial'
  const API_CITAS = 'http://localhost:8080/api/reportes/citas'

  useEffect(() => {
    cargarDetalle()
  }, [idHistorial, citaId])

  const cargarDetalle = async () => {
    setLoading(true)
    setError('')

    try {
      if (citaId) {
        const data = await citasAPI.getById(citaId)
        setCita(data?.data || data)
        setTipoVista('cita')
        return
      }

      if (idHistorial) {
        const data = await historialAPI.getById(idHistorial)
        setRegistro(data?.data || data)
        setTipoVista('historial')
        return
      }

      setError('No se encontró información para mostrar')
    } catch (err) {
      console.error(err)
      setError('Error al cargar la información')
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'No registrado'
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return 'No registrado'
    return String(hora).substring(0, 5)
  }

  const imprimirPDF = () => {
    if (tipoVista === 'cita') {
      window.open(`${API_CITAS}/${citaId}/pdf`, '_blank')
    } else {
      window.open(`${API_HISTORIAL}/${idHistorial}/pdf`, '_blank')
    }
  }

  const descargarPDF = () => {
    const link = document.createElement('a')

    if (tipoVista === 'cita') {
      link.href = `${API_CITAS}/${citaId}/pdf`
      link.download = `comprobante_cita_${citaId}.pdf`
    } else {
      link.href = `${API_HISTORIAL}/${idHistorial}/pdf`
      link.download = `registro_medico_${idHistorial}.pdf`
    }

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-registro-container">Cargando información...</div>
      </LayoutWithSidebar>
    )
  }

  if (error) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-registro-container">
          <div className="error-message">{error}</div>
          <button className="btn-volver-detalle" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="detalle-registro-container">
        <div className="detalle-titulo">
          {tipoVista === 'cita' ? 'Comprobante de Cita Médica' : 'Detalles del Registro Médico'}
        </div>

        {tipoVista === 'cita' && cita && (
          <>
            <div className="detalle-card">
              <h2>Información de la Cita</h2>
              <div className="detalle-linea"></div>

              <div className="detalle-fila">
                <strong>N° Cita:</strong>
                <span>{cita.idCita || cita.id_cita || cita.id}</span>
              </div>

              <div className="detalle-fila">
                <strong>Fecha:</strong>
                <span>{formatFecha(cita.fecha)}</span>
              </div>

              <div className="detalle-fila">
                <strong>Hora:</strong>
                <span>{formatHora(cita.hora)}</span>
              </div>

              <div className="detalle-fila">
                <strong>Estado:</strong>
                <span>{cita.estado || 'programada'}</span>
              </div>

              <div className="detalle-fila">
                <strong>Motivo:</strong>
                <span>{cita.motivo || 'Consulta médica'}</span>
              </div>
            </div>

            <div className="detalle-card">
              <h2>Datos del Médico</h2>
              <div className="detalle-linea"></div>

              <div className="detalle-fila">
                <strong>Médico:</strong>
                <span>
                  {cita.medico?.nombre || 'No registrado'} {cita.medico?.apellido || ''}
                </span>
              </div>

              <div className="detalle-fila">
                <strong>Especialidad:</strong>
                <span>
                  {cita.medico?.especialidad?.nombre ||
                    cita.medico?.especialidad ||
                    'No registrada'}
                </span>
              </div>
            </div>

            <div className="detalle-card">
              <h2>Datos del Paciente</h2>
              <div className="detalle-linea"></div>

              <div className="detalle-fila">
                <strong>Paciente:</strong>
                <span>
                  {cita.paciente?.nombre || 'No registrado'} {cita.paciente?.apellido || ''}
                </span>
              </div>

              <div className="detalle-fila">
                <strong>DNI:</strong>
                <span>{cita.paciente?.dni || 'No registrado'}</span>
              </div>
            </div>
          </>
        )}

        {tipoVista === 'historial' && registro && (
          <>
            <div className="detalle-card">
              <h2>Información General</h2>
              <div className="detalle-linea"></div>

              <div className="detalle-fila">
                <strong>Fecha:</strong>
                <span>{formatFecha(registro.fechaRegistro)}</span>
              </div>

              <div className="detalle-fila">
                <strong>Médico Tratante:</strong>
                <span>
                  {registro.medico?.nombre || 'No registrado'} {registro.medico?.apellido || ''}
                </span>
              </div>

              <div className="detalle-fila">
                <strong>Paciente:</strong>
                <span>
                  {registro.paciente?.nombre || 'No registrado'} {registro.paciente?.apellido || ''}
                </span>
              </div>
            </div>

            <div className="detalle-card">
              <h2>Diagnóstico</h2>
              <div className="detalle-linea"></div>

              <div className="detalle-fila">
                <strong>Diagnóstico Principal:</strong>
                <span>{registro.diagnostico || 'No especificado'}</span>
              </div>

              <div className="detalle-fila">
                <strong>Observaciones:</strong>
                <span>{registro.observaciones || 'Sin observaciones'}</span>
              </div>
            </div>

            <div className="detalle-card">
              <h2>Tratamiento e Indicaciones</h2>
              <div className="detalle-linea"></div>

              <div className="detalle-fila">
                <strong>Tratamiento:</strong>
                <span>{registro.tratamiento || 'No especificado'}</span>
              </div>
            </div>
          </>
        )}

        <div className="detalle-botones-card">
          <button className="btn-volver-detalle" onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <button className="btn-imprimir-detalle" onClick={imprimirPDF}>
            🖨️ Imprimir
          </button>

          <button className="btn-descargar-detalle" onClick={descargarPDF}>
            ⬇️ Descargar PDF
          </button>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default DetalleRegistro