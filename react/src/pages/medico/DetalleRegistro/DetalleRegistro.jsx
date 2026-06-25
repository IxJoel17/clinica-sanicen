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

  const LOGO_URL = '/logo.png'

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
      const historiales = await historialAPI.getAllByPaciente(1)

      const historialEncontrado = historiales.find(
        (h) => h.idHistorial === parseInt(idHistorial)
      )

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

  const obtenerEspecialidad = () => {
    return (
      cita?.medico?.especialidad?.nombre ||
      cita?.medico?.especialidadNombre ||
      cita?.medico?.especialidad ||
      cita?.especialidad?.nombre ||
      cita?.especialidadNombre ||
      cita?.especialidad ||
      'No registrado'
    )
  }

  const obtenerPaciente = () => {
    return `${cita?.paciente?.nombre || ''} ${cita?.paciente?.apellido || ''}`.trim()
  }

  const obtenerMedico = () => {
    return `${cita?.medico?.nombre || ''} ${cita?.medico?.apellido || ''}`.trim()
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'No registrado'

    try {
      const date = new Date(fecha)

      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return fecha
    }
  }

  const formatHora = (hora) => {
    if (!hora) return 'No registrado'

    try {
      const time = hora.substring(0, 5)
      const [hours, minutes] = time.split(':')
      const hourNumber = parseInt(hours)
      const hour12 = hourNumber > 12 ? hourNumber - 12 : hourNumber
      const ampm = hourNumber >= 12 ? 'PM' : 'AM'

      return `${hour12}:${minutes} ${ampm}`
    } catch {
      return hora
    }
  }

  const obtenerEstadoBonito = (estado) => {
    if (!estado) return 'Registrada'

    const texto = estado.toLowerCase()

    if (texto === 'programada') return 'Programada'
    if (texto === 'pendiente') return 'Pendiente'
    if (texto === 'completada') return 'Completada'
    if (texto === 'cancelada') return 'Cancelada'

    return estado
  }

  const imprimirCita = () => {
    const ventana = window.open('', '_blank')

    if (!ventana) {
      alert('El navegador bloqueó la ventana emergente. Permite ventanas emergentes para imprimir.')
      return
    }

    ventana.document.write(`
      <html>
        <head>
          <title>Comprobante de Cita Médica</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #0d2238;
              background: #f5f7fa;
            }

            .documento {
              max-width: 900px;
              margin: auto;
              background: #ffffff;
              border: 1px solid #dcdcdc;
              padding: 35px 42px;
              border-radius: 14px;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
            }

            .encabezado {
              text-align: center;
              margin-bottom: 35px;
              border-bottom: 3px solid #00bcd4;
              padding-bottom: 22px;
            }

            .logo {
              width: 95px;
              height: auto;
              margin-bottom: 10px;
            }

            h1 {
              color: #e8505b;
              font-size: 34px;
              margin: 0 0 8px 0;
              letter-spacing: 1px;
            }

            h2 {
              color: #0d2238;
              font-size: 25px;
              margin: 0;
            }

            .seccion {
              margin-top: 26px;
              padding: 22px 24px;
              border-radius: 14px;
              background: #f8fbfd;
              border-left: 6px solid #00bcd4;
            }

            .seccion h3 {
              margin: 0 0 18px 0;
              color: #e8505b;
              font-size: 20px;
            }

            .fila {
              display: flex;
              margin-bottom: 14px;
              font-size: 17px;
              line-height: 1.5;
            }

            .label {
              font-weight: bold;
              min-width: 160px;
              color: #0d2238;
            }

            .valor {
              color: #0d2238;
            }

            .estado {
              display: inline-block;
              padding: 6px 15px;
              border-radius: 20px;
              background: #e8f5e9;
              color: #2e7d32;
              font-weight: bold;
            }

            .footer {
              margin-top: 38px;
              text-align: center;
              font-size: 13px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 18px;
            }

            @media print {
              body {
                background: #ffffff;
              }

              .documento {
                box-shadow: none;
                border: 1px solid #dcdcdc;
              }
            }
          </style>
        </head>

        <body>
          <div class="documento">
            <div class="encabezado">
              <img class="logo" src="${LOGO_URL}" alt="Logo Clínica Sanicen" onerror="this.style.display='none'" />
              <h1>Clínica Sanicen</h1>
              <h2>Comprobante de Cita Médica</h2>
            </div>

            <div class="seccion">
              <h3>Datos del paciente</h3>

              <div class="fila">
                <span class="label">Paciente:</span>
                <span class="valor">${obtenerPaciente() || 'No registrado'}</span>
              </div>
            </div>

            <div class="seccion">
              <h3>Datos de la atención</h3>

              <div class="fila">
                <span class="label">Médico:</span>
                <span class="valor">${obtenerMedico() || 'No registrado'}</span>
              </div>

              <div class="fila">
                <span class="label">Especialidad:</span>
                <span class="valor">${obtenerEspecialidad()}</span>
              </div>

              <div class="fila">
                <span class="label">Fecha:</span>
                <span class="valor">${cita?.fecha || 'No registrado'}</span>
              </div>

              <div class="fila">
                <span class="label">Hora:</span>
                <span class="valor">${cita?.hora || 'No registrado'}</span>
              </div>

              <div class="fila">
                <span class="label">Motivo:</span>
                <span class="valor">${cita?.motivo || 'No registrado'}</span>
              </div>

              <div class="fila">
                <span class="label">Estado:</span>
                <span class="estado">${obtenerEstadoBonito(cita?.estado)}</span>
              </div>
            </div>

            <div class="footer">
              Documento generado por el Sistema Clínica Sanicen
            </div>
          </div>
        </body>
      </html>
    `)

    ventana.document.close()
    ventana.focus()

    setTimeout(() => {
      ventana.print()
    }, 500)
  }

  const abrirPDFBackend = () => {
    if (!cita?.idCita && !idCita) {
      alert('No se encontró el ID de la cita')
      return
    }

    const id = cita?.idCita || idCita

    window.open(`http://localhost:8080/api/reportes/citas/${id}/pdf`, '_blank')
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

  if (registro) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-container container">
          <div className="header-detalle">Detalles del Registro Médico</div>

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

  if (cita) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-container container">
          <div className="header-detalle">Detalles de la Cita</div>

          <div className="comprobante-cita-preview">
            <div className="comprobante-header">
              <img
                src={LOGO_URL}
                alt="Logo Clínica Sanicen"
                className="comprobante-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              <h1>Clínica Sanicen</h1>
              <h2>Comprobante de Cita Médica</h2>
            </div>

            <div className="comprobante-seccion">
              <h3>Datos del paciente</h3>

              <div className="comprobante-fila">
                <strong>Paciente:</strong>
                <span>{obtenerPaciente() || 'No registrado'}</span>
              </div>
            </div>

            <div className="comprobante-seccion">
              <h3>Datos de la atención</h3>

              <div className="comprobante-fila">
                <strong>Médico:</strong>
                <span>{obtenerMedico() || 'No registrado'}</span>
              </div>

              <div className="comprobante-fila">
                <strong>Especialidad:</strong>
                <span>{obtenerEspecialidad()}</span>
              </div>

              <div className="comprobante-fila">
                <strong>Fecha:</strong>
                <span>{cita.fecha || 'No registrado'}</span>
              </div>

              <div className="comprobante-fila">
                <strong>Hora:</strong>
                <span>{cita.hora || 'No registrado'}</span>
              </div>

              <div className="comprobante-fila">
                <strong>Motivo:</strong>
                <span>{cita.motivo || 'No registrado'}</span>
              </div>

              <div className="comprobante-fila">
                <strong>Estado:</strong>
                <span className="estado-comprobante">
                  {obtenerEstadoBonito(cita.estado)}
                </span>
              </div>
            </div>

            <div className="comprobante-footer">
              Documento generado por el Sistema Clínica Sanicen
            </div>
          </div>

          <div className="acciones-cita-detalle">
            <Link to="/citas" className="btn-volver btn-volver-citas">
              Volver a Citas
            </Link>

            <button
              type="button"
              className="btn-imprimir-cita"
              onClick={imprimirCita}
            >
              🖨️ Imprimir
            </button>

            <button
              type="button"
              className="btn-descargar-cita"
              onClick={abrirPDFBackend}
            >
              📄 Abrir PDF
            </button>
          </div>
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