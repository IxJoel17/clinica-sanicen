import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { citasAPI, medicosAPI, historialAPI, recetasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './DetalleCitaMedico.css'

function DetalleCitaMedico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cita, setCita] = useState(null)
  const [medicoInfo, setMedicoInfo] = useState(null)
  const [historiales, setHistoriales] = useState([])
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  
  // Formularios
  const [asistio, setAsistio] = useState(null)
  const [historialData, setHistorialData] = useState({
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  })
  const [recetaData, setRecetaData] = useState({
    indicaciones: '',
  })

  useEffect(() => {
    if (user?.correo && id) {
      cargarDatos()
    }
  }, [user, id])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      // Cargar información del médico
      const medico = await medicosAPI.getByCorreo(user.correo)
      setMedicoInfo(medico)

      // Cargar detalles de la cita
      const citaData = await citasAPI.getById(id)
      setCita(citaData)

      // Si hay paciente, cargar su historial y recetas
      if (citaData?.paciente?.idPaciente) {
        cargarHistorialPaciente(citaData.paciente.idPaciente)
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
      setError('Error al cargar los detalles de la cita')
    } finally {
      setLoading(false)
    }
  }

  const cargarHistorialPaciente = async (idPaciente) => {
    setLoadingHistorial(true)
    try {
      const [historialesData, recetasData] = await Promise.all([
        historialAPI.getAllByPaciente(idPaciente).catch(() => []),
        recetasAPI.getByPaciente(idPaciente).catch(() => []),
      ])

      // Ordenar historiales de más reciente a más antiguo
      const historialesOrdenados = (historialesData?.data || historialesData || []).sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro || a.fechaCreacion || a.fecha || 0)
        const fechaB = new Date(b.fechaRegistro || b.fechaCreacion || b.fecha || 0)
        return fechaB - fechaA // Más reciente primero
      })

      // Ordenar recetas de más reciente a más antiguo
      const recetasOrdenadas = (recetasData?.data || recetasData || []).sort((a, b) => {
        const fechaA = new Date(a.fecha || a.fechaCreacion || a.fechaRegistro || 0)
        const fechaB = new Date(b.fecha || b.fechaCreacion || b.fechaRegistro || 0)
        return fechaB - fechaA // Más reciente primero
      })

      // Relacionar recetas con historiales por fecha (mismo día) y mismo médico
      const historialesConRecetas = historialesOrdenados.map((historial) => {
        const fechaHistorial = new Date(historial.fechaRegistro || historial.fechaCreacion || historial.fecha)
        const fechaHistorialDia = fechaHistorial.toDateString()
        const recetasRelacionadas = recetasOrdenadas.filter((receta) => {
          const fechaReceta = new Date(receta.fecha || receta.fechaCreacion || receta.fechaRegistro)
          const fechaRecetaDia = fechaReceta.toDateString()
          // Misma fecha y mismo médico
          return (
            fechaHistorialDia === fechaRecetaDia &&
            historial.medico?.idMedico === receta.medico?.idMedico
          )
        })
        return { ...historial, recetas: recetasRelacionadas }
      })

      setHistoriales(historialesConRecetas)
      setRecetas(recetasOrdenadas)
    } catch (err) {
      console.error('Error cargando historial del paciente:', err)
    } finally {
      setLoadingHistorial(false)
    }
  }

  const handleConfirmarAsistencia = async (asistioPaciente) => {
    if (!asistioPaciente) {
      setAsistio(false)
      setShowForm(true)
      return
    }

    setConfirmando(true)
    setError('')

    try {
      // Actualizar estado de la cita
      await citasAPI.update(id, {
        estado: asistioPaciente ? 'confirmada' : 'cancelada',
      })

      if (asistioPaciente) {
        // Si asistió, mostrar formulario para crear tratamiento y receta
        setAsistio(true)
        setShowForm(true)
      } else {
        alert('✅ Cita marcada como cancelada (paciente no asistió)')
        navigate('/medico/citas')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al confirmar la asistencia')
    } finally {
      setConfirmando(false)
    }
  }

  const handleGuardarTratamientoYReceta = async (e) => {
    e.preventDefault()
    setError('')

    if (!cita || !medicoInfo) {
      setError('Error: No se encontró información de la cita o médico')
      return
    }

    try {
      // Crear historial médico
      if (historialData.diagnostico || historialData.tratamiento) {
        await historialAPI.create({
          idPaciente: cita.paciente?.idPaciente,
          idMedico: medicoInfo.idMedico,
          diagnostico: historialData.diagnostico,
          tratamiento: historialData.tratamiento,
          observaciones: historialData.observaciones,
        })
      }

      // Crear receta si hay indicaciones
      if (recetaData.indicaciones) {
        await recetasAPI.create({
          idPaciente: cita.paciente?.idPaciente,
          idMedico: medicoInfo.idMedico,
          indicaciones: recetaData.indicaciones,
        })
      }

      alert('✅ Tratamiento y receta guardados exitosamente')
      
      // Actualizar estado de la cita a completada
      await citasAPI.update(id, {
        estado: 'completada',
      })

      // Recargar historial y recetas del paciente
      if (cita?.paciente?.idPaciente) {
        await cargarHistorialPaciente(cita.paciente.idPaciente)
      }

      // Cerrar el formulario
      setShowForm(false)
      setAsistio(null)
      
      // Recargar los datos de la cita actualizada
      const citaActualizada = await citasAPI.getById(id)
      setCita(citaActualizada)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el tratamiento y receta')
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return fecha
    }
  }

  const formatFechaCorta = (fecha) => {
    if (!fecha) return ''
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return fecha
    }
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return hora.substring(0, 5)
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-cita-medico-container container">
          <div>Cargando detalles de la cita...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  if (error && !cita) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-cita-medico-container container">
          <div className="error-message">{error}</div>
          <Link to="/medico/citas" className="btn-volver">
            ← Volver a Mis Citas
          </Link>
        </div>
      </LayoutWithSidebar>
    )
  }

  if (!cita) {
    return (
      <LayoutWithSidebar>
        <div className="detalle-cita-medico-container container">
          <div className="error-message">Cita no encontrada</div>
          <Link to="/medico/citas" className="btn-volver">
            ← Volver a Mis Citas
          </Link>
        </div>
      </LayoutWithSidebar>
    )
  }

  const puedeConfirmar = cita.estado === 'programada' || cita.estado === 'pendiente'

  return (
    <LayoutWithSidebar>
      <div className="detalle-cita-medico-container container">
        <div className="detalle-cita-header">
          <Link to="/medico/citas" className="btn-volver-header">
            ← Volver
          </Link>
          <h1>Detalle de Cita</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="detalle-cita-content">
          {/* Información de la Cita */}
          <div className="cita-info-section">
            <h2>Información de la Cita</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>Fecha:</strong>
                <span>{formatFecha(cita.fecha)}</span>
              </div>
              <div className="info-item">
                <strong>Hora:</strong>
                <span>{formatHora(cita.hora)}</span>
              </div>
              <div className="info-item">
                <strong>Estado:</strong>
                <span className={`estado-badge estado-${cita.estado}`}>{cita.estado}</span>
              </div>
              <div className="info-item full-width">
                <strong>Motivo:</strong>
                <span>{cita.motivo || 'Consulta médica'}</span>
              </div>
            </div>
          </div>

          {/* Información del Paciente */}
          {cita.paciente && (
            <div className="paciente-info-section">
              <h2>Información del Paciente</h2>
              <div className="info-grid">
                <div className="info-item full-width">
                  <strong>Nombre:</strong>
                  <span>{cita.paciente.nombre} {cita.paciente.apellido}</span>
                </div>
                {cita.paciente.nroHistoria && (
                  <div className="info-item">
                    <strong>Nro. Historia:</strong>
                    <span>{cita.paciente.nroHistoria}</span>
                  </div>
                )}
                {cita.paciente.telefono && (
                  <div className="info-item">
                    <strong>Teléfono:</strong>
                    <span>{cita.paciente.telefono}</span>
                  </div>
                )}
              </div>

              {/* Historial Médico del Paciente */}
              {loadingHistorial ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Cargando historial...</div>
              ) : (
                <div className="historial-paciente-section">
                  {/* Historial Médico */}
                  {historiales.length > 0 && (
                    <div className="historial-subsection">
                      <h3>Historial Médico</h3>
                      <div className="historial-list">
                        {historiales.map((historial) => (
                          <div key={historial.idHistorial} className="historial-item">
                            <div className="historial-header">
                              <span className="historial-fecha">
                                {formatFechaCorta(historial.fechaRegistro || historial.fechaCreacion || historial.fecha)}
                              </span>
                              {historial.medico && (
                                <span className="historial-medico">
                                  Dr(a). {historial.medico.nombre} {historial.medico.apellido}
                                </span>
                              )}
                            </div>
                            {historial.diagnostico && (
                              <div className="historial-detail">
                                <strong>Diagnóstico:</strong>
                                <p>{historial.diagnostico}</p>
                              </div>
                            )}
                            {historial.tratamiento && (
                              <div className="historial-detail">
                                <strong>Tratamiento:</strong>
                                <p>{historial.tratamiento}</p>
                              </div>
                            )}
                            {historial.observaciones && (
                              <div className="historial-detail">
                                <strong>Observaciones:</strong>
                                <p>{historial.observaciones}</p>
                              </div>
                            )}
                            {/* Recetas relacionadas con este historial */}
                            {historial.recetas && historial.recetas.length > 0 && (
                              <div className="historial-recetas">
                                <strong>Recetas:</strong>
                                {historial.recetas.map((receta) => (
                                  <div key={receta.idReceta} className="receta-inline">
                                    <p>{receta.indicaciones}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {historiales.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                      No hay historial médico, tratamientos ni recetas registrados para este paciente.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Confirmar Asistencia */}
          {puedeConfirmar && !showForm && (
            <div className="confirmar-asistencia-section">
              <h2>Confirmar Asistencia</h2>
              <p>¿El paciente asistió a la consulta?</p>
              <div className="botones-asistencia">
                <button
                  onClick={() => handleConfirmarAsistencia(true)}
                  disabled={confirmando}
                  className="btn-si-asistio"
                >
                  ✓ Sí, asistió
                </button>
                <button
                  onClick={() => handleConfirmarAsistencia(false)}
                  disabled={confirmando}
                  className="btn-no-asistio"
                >
                  ✗ No asistió
                </button>
              </div>
            </div>
          )}

          {/* Formulario de Tratamiento y Receta */}
          {showForm && asistio && (
            <form className="form-tratamiento-receta" onSubmit={handleGuardarTratamientoYReceta}>
              <h2>Registrar Tratamiento y Receta</h2>

              <div className="form-section">
                <h3>Historial Médico</h3>
                <div className="form-group">
                  <label htmlFor="diagnostico">Diagnóstico *</label>
                  <textarea
                    id="diagnostico"
                    rows="3"
                    value={historialData.diagnostico}
                    onChange={(e) =>
                      setHistorialData({ ...historialData, diagnostico: e.target.value })
                    }
                    required
                    placeholder="Ingrese el diagnóstico del paciente"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tratamiento">Tratamiento *</label>
                  <textarea
                    id="tratamiento"
                    rows="4"
                    value={historialData.tratamiento}
                    onChange={(e) =>
                      setHistorialData({ ...historialData, tratamiento: e.target.value })
                    }
                    required
                    placeholder="Ingrese el tratamiento recomendado"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="observaciones">Observaciones</label>
                  <textarea
                    id="observaciones"
                    rows="3"
                    value={historialData.observaciones}
                    onChange={(e) =>
                      setHistorialData({ ...historialData, observaciones: e.target.value })
                    }
                    placeholder="Observaciones adicionales (opcional)"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Receta Médica</h3>
                <div className="form-group">
                  <label htmlFor="indicaciones">Indicaciones de la Receta</label>
                  <textarea
                    id="indicaciones"
                    rows="5"
                    value={recetaData.indicaciones}
                    onChange={(e) => setRecetaData({ indicaciones: e.target.value })}
                    placeholder="Ingrese las indicaciones de medicamentos, dosis, frecuencia, etc. (opcional)"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-guardar-todo">
                  ✓ Guardar Tratamiento y Receta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setAsistio(null)
                  }}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {showForm && !asistio && (
            <div className="no-asistio-section">
              <h2>Paciente No Asistió</h2>
              <p>El paciente no asistió a la consulta. La cita será marcada como cancelada.</p>
              <button
                onClick={async () => {
                  try {
                    await citasAPI.update(id, { estado: 'cancelada' })
                    alert('✅ Cita marcada como cancelada')
                    navigate('/medico/citas')
                  } catch (err) {
                    setError('Error al cancelar la cita')
                  }
                }}
                className="btn-confirmar-cancelacion"
              >
                Confirmar Cancelación
              </button>
            </div>
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default DetalleCitaMedico

