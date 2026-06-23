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
  const [loading, setLoading] = useState(true)
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [asistio, setAsistio] = useState(null)

  const [historialData, setHistorialData] = useState({
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  })

  const [recetaData, setRecetaData] = useState({
    indicaciones: '',
  })

  const [detalleMedicamento, setDetalleMedicamento] = useState({
    medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    instrucciones: '',
  })

  const [detallesReceta, setDetallesReceta] = useState([])

  const [recetaEditando, setRecetaEditando] = useState(null)

  const [recetaEditData, setRecetaEditData] = useState({
    indicaciones: '',
  })

  const [detalleEditMedicamento, setDetalleEditMedicamento] = useState({
    medicamento: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    instrucciones: '',
  })

  const [detallesEditReceta, setDetallesEditReceta] = useState([])

  useEffect(() => {
    if (user?.correo && id) {
      cargarDatos()
    }
  }, [user, id])

  const cargarDatos = async () => {
    setLoading(true)

    try {
      const medico = await medicosAPI.getByCorreo(user.correo)
      setMedicoInfo(medico)

      const citaData = await citasAPI.getById(id)
      setCita(citaData)

      if (citaData?.paciente?.idPaciente) {
        await cargarHistorialPaciente(citaData.paciente.idPaciente)
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

      const historialesOrdenados = (historialesData?.data || historialesData || []).sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro || a.fechaCreacion || a.fecha || 0)
        const fechaB = new Date(b.fechaRegistro || b.fechaCreacion || b.fecha || 0)
        return fechaB - fechaA
      })

      const recetasOrdenadas = (recetasData?.data || recetasData || []).sort((a, b) => {
        const fechaA = new Date(a.fecha || a.fechaCreacion || a.fechaRegistro || 0)
        const fechaB = new Date(b.fecha || b.fechaCreacion || b.fechaRegistro || 0)
        return fechaB - fechaA
      })

      const historialesConRecetas = historialesOrdenados.map((historial) => {
        const recetasRelacionadas = recetasOrdenadas.filter((receta) => {
          return historial.medico?.idMedico === receta.medico?.idMedico
        })

        return {
          ...historial,
          recetas: recetasRelacionadas,
        }
      })

      setHistoriales(historialesConRecetas)
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
      await citasAPI.update(id, {
        estado: asistioPaciente ? 'confirmada' : 'cancelada',
      })

      if (asistioPaciente) {
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

  const handleDetalleChange = (e) => {
    const { name, value } = e.target

    setDetalleMedicamento({
      ...detalleMedicamento,
      [name]: value,
    })
  }

  const agregarMedicamento = () => {
    if (!detalleMedicamento.medicamento.trim()) {
      alert('Ingrese el nombre del medicamento')
      return
    }

    setDetallesReceta([...detallesReceta, detalleMedicamento])

    setDetalleMedicamento({
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      instrucciones: '',
    })
  }

  const eliminarMedicamento = (index) => {
    const nuevosDetalles = detallesReceta.filter((_, i) => i !== index)
    setDetallesReceta(nuevosDetalles)
  }

  const limpiarFormulario = () => {
    setHistorialData({
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
    })

    setRecetaData({
      indicaciones: '',
    })

    setDetalleMedicamento({
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      instrucciones: '',
    })

    setDetallesReceta([])
  }

  const handleGuardarTratamientoYReceta = async (e) => {
    e.preventDefault()
    setError('')

    if (!cita || !medicoInfo) {
      setError('Error: No se encontró información de la cita o médico')
      return
    }

    try {
      if (historialData.diagnostico || historialData.tratamiento) {
        await historialAPI.create({
          idPaciente: cita.paciente?.idPaciente,
          idMedico: medicoInfo.idMedico,
          diagnostico: historialData.diagnostico,
          tratamiento: historialData.tratamiento,
          observaciones: historialData.observaciones,
        })
      }

      if (recetaData.indicaciones || detallesReceta.length > 0) {
        await recetasAPI.create({
          idPaciente: cita.paciente?.idPaciente,
          idMedico: medicoInfo.idMedico,
          indicaciones: recetaData.indicaciones,
          detalles: detallesReceta,
        })
      }

      await citasAPI.update(id, {
        estado: 'completada',
      })

      alert('✅ Tratamiento y receta guardados exitosamente')

      if (cita?.paciente?.idPaciente) {
        await cargarHistorialPaciente(cita.paciente.idPaciente)
      }

      setShowForm(false)
      setAsistio(null)
      limpiarFormulario()

      const citaActualizada = await citasAPI.getById(id)
      setCita(citaActualizada)
    } catch (err) {
      console.error('Error al guardar:', err)
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

  const abrirRecetaPDF = (idReceta) => {
    window.open(`http://localhost:8080/api/reportes/recetas/${idReceta}/pdf`, '_blank')
  }

  const abrirHistorialPDF = (idHistorial) => {
    window.open(`http://localhost:8080/api/reportes/historial/${idHistorial}/pdf`, '_blank')
  }

  const minutosDesdeReceta = (fechaReceta) => {
    if (!fechaReceta) return 999999

    const fechaCreacion = new Date(fechaReceta)
    const ahora = new Date()

    return (ahora - fechaCreacion) / (1000 * 60)
  }

  const puedeModificarReceta = (fechaReceta) => {
    const minutos = minutosDesdeReceta(fechaReceta)
    return minutos <= 10
  }

  const debeMostrarBloqueado = (fechaReceta) => {
    const minutos = minutosDesdeReceta(fechaReceta)
    return minutos > 10 && minutos <= 1440
  }

  const minutosRestantesEdicion = (fechaReceta) => {
    const minutos = minutosDesdeReceta(fechaReceta)
    const restantes = 10 - minutos

    return Math.max(0, Math.ceil(restantes))
  }

  const modificarReceta = (receta) => {
    setRecetaEditando(receta)

    setRecetaEditData({
      indicaciones: receta.indicaciones || '',
    })

    setDetallesEditReceta(receta.detalles || [])

    setDetalleEditMedicamento({
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      instrucciones: '',
    })
  }

  const handleDetalleEditChange = (e) => {
    const { name, value } = e.target

    setDetalleEditMedicamento({
      ...detalleEditMedicamento,
      [name]: value,
    })
  }

  const agregarMedicamentoEdit = () => {
    if (!detalleEditMedicamento.medicamento.trim()) {
      alert('Ingrese el nombre del medicamento')
      return
    }

    setDetallesEditReceta([...detallesEditReceta, detalleEditMedicamento])

    setDetalleEditMedicamento({
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      instrucciones: '',
    })
  }

  const eliminarMedicamentoEdit = (index) => {
    const nuevosDetalles = detallesEditReceta.filter((_, i) => i !== index)
    setDetallesEditReceta(nuevosDetalles)
  }

  const cancelarEdicionReceta = () => {
    setRecetaEditando(null)

    setRecetaEditData({
      indicaciones: '',
    })

    setDetalleEditMedicamento({
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      instrucciones: '',
    })

    setDetallesEditReceta([])
  }

  const guardarEdicionReceta = async () => {
    if (!recetaEditando) return

    try {
      await recetasAPI.update(recetaEditando.idReceta, {
        indicaciones: recetaEditData.indicaciones,
        detalles: detallesEditReceta,
      })

      alert('✅ Receta modificada correctamente')

      cancelarEdicionReceta()

      if (cita?.paciente?.idPaciente) {
        await cargarHistorialPaciente(cita.paciente.idPaciente)
      }
    } catch (err) {
      console.error('Error modificando receta:', err)
      alert(err.response?.data?.error || 'Error al modificar la receta')
    }
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

        {error && <div className="error-message">{error}</div>}

        <div className="detalle-cita-content">
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
                <span className={`estado-badge estado-${cita.estado}`}>
                  {cita.estado}
                </span>
              </div>

              <div className="info-item full-width">
                <strong>Motivo:</strong>
                <span>{cita.motivo || 'Consulta médica'}</span>
              </div>
            </div>
          </div>

          {cita.paciente && (
            <div className="paciente-info-section">
              <h2>Información del Paciente</h2>

              <div className="info-grid">
                <div className="info-item full-width">
                  <strong>Nombre:</strong>
                  <span>
                    {cita.paciente.nombre} {cita.paciente.apellido}
                  </span>
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

              {loadingHistorial ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Cargando historial...
                </div>
              ) : (
                <div className="historial-paciente-section">
                  {historiales.length > 0 && (
                    <div className="historial-subsection">
                      <h3>Historial Médico</h3>

                      <div className="historial-list">
                        {historiales.map((historial) => (
                          <div key={historial.idHistorial} className="historial-item">
                            <div className="historial-header">
                              <span className="historial-fecha">
                                {formatFechaCorta(
                                  historial.fechaRegistro ||
                                    historial.fechaCreacion ||
                                    historial.fecha
                                )}
                              </span>

                              {historial.medico && (
                                <span className="historial-medico">
                                  Dr(a). {historial.medico.nombre}{' '}
                                  {historial.medico.apellido}
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

                            <div className="acciones-historial">
                              <button
                                type="button"
                                className="btn-historial-pdf"
                                onClick={() => abrirHistorialPDF(historial.idHistorial)}
                              >
                                📄 Descargar historial PDF
                              </button>
                            </div>

                            {historial.recetas && historial.recetas.length > 0 && (
                              <div className="historial-recetas">
                                <strong>Recetas:</strong>

                                {historial.recetas.map((receta) => (
                                  <div key={receta.idReceta} className="receta-inline">
                                    <p>{receta.indicaciones || 'Sin indicaciones generales'}</p>

                                    {receta.detalles && receta.detalles.length > 0 && (
                                      <ul>
                                        {receta.detalles.map((detalle, index) => (
                                          <li key={detalle.idDetalleReceta || index}>
                                            {detalle.medicamento} - {detalle.dosis} -{' '}
                                            {detalle.frecuencia}
                                          </li>
                                        ))}
                                      </ul>
                                    )}

                                    <div className="acciones-receta">
                                      <button
                                        type="button"
                                        className="btn-receta-pdf"
                                        onClick={() => abrirRecetaPDF(receta.idReceta)}
                                      >
                                        📄 Descargar PDF
                                      </button>

                                      {puedeModificarReceta(receta.fecha) && (
                                        <button
                                          type="button"
                                          className="btn-receta-editar"
                                          onClick={() => modificarReceta(receta)}
                                        >
                                          ✏️ Modificar receta
                                          <span className="tiempo-edicion">
                                            {minutosRestantesEdicion(receta.fecha)} min restantes
                                          </span>
                                        </button>
                                      )}

                                      {debeMostrarBloqueado(receta.fecha) && (
                                        <span className="edicion-bloqueada">
                                          🔒 Edición bloqueada
                                        </span>
                                      )}
                                    </div>

                                    {recetaEditando?.idReceta === receta.idReceta && (
                                      <div className="editar-receta-box">
                                        <h4>Modificar receta médica</h4>

                                        <div className="form-grid">
                                          <div className="form-group">
                                            <label>Medicamento</label>
                                            <input
                                              type="text"
                                              name="medicamento"
                                              value={detalleEditMedicamento.medicamento}
                                              onChange={handleDetalleEditChange}
                                              placeholder="Ej: Paracetamol 500 mg"
                                            />
                                          </div>

                                          <div className="form-group">
                                            <label>Dosis</label>
                                            <input
                                              type="text"
                                              name="dosis"
                                              value={detalleEditMedicamento.dosis}
                                              onChange={handleDetalleEditChange}
                                              placeholder="Ej: 1 tableta"
                                            />
                                          </div>

                                          <div className="form-group">
                                            <label>Frecuencia</label>
                                            <input
                                              type="text"
                                              name="frecuencia"
                                              value={detalleEditMedicamento.frecuencia}
                                              onChange={handleDetalleEditChange}
                                              placeholder="Ej: Cada 8 horas"
                                            />
                                          </div>

                                          <div className="form-group">
                                            <label>Duración</label>
                                            <input
                                              type="text"
                                              name="duracion"
                                              value={detalleEditMedicamento.duracion}
                                              onChange={handleDetalleEditChange}
                                              placeholder="Ej: 3 días"
                                            />
                                          </div>
                                        </div>

                                        <div className="form-group">
                                          <label>Instrucciones</label>
                                          <textarea
                                            name="instrucciones"
                                            value={detalleEditMedicamento.instrucciones}
                                            onChange={handleDetalleEditChange}
                                            placeholder="Ej: Tomar después de los alimentos"
                                            rows="3"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          className="btn-agregar-medicamento"
                                          onClick={agregarMedicamentoEdit}
                                        >
                                          + Agregar medicamento
                                        </button>

                                        {detallesEditReceta.length > 0 && (
                                          <table className="tabla-medicamentos">
                                            <thead>
                                              <tr>
                                                <th>Medicamento</th>
                                                <th>Dosis</th>
                                                <th>Frecuencia</th>
                                                <th>Duración</th>
                                                <th>Instrucciones</th>
                                                <th>Acción</th>
                                              </tr>
                                            </thead>

                                            <tbody>
                                              {detallesEditReceta.map((detalle, index) => (
                                                <tr key={detalle.idDetalleReceta || index}>
                                                  <td>{detalle.medicamento}</td>
                                                  <td>{detalle.dosis}</td>
                                                  <td>{detalle.frecuencia}</td>
                                                  <td>{detalle.duracion}</td>
                                                  <td>{detalle.instrucciones}</td>
                                                  <td>
                                                    <button
                                                      type="button"
                                                      className="btn-eliminar-medicamento"
                                                      onClick={() => eliminarMedicamentoEdit(index)}
                                                    >
                                                      Eliminar
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        )}

                                        <div className="form-group">
                                          <label>Indicaciones generales</label>
                                          <textarea
                                            rows="4"
                                            value={recetaEditData.indicaciones}
                                            onChange={(e) =>
                                              setRecetaEditData({
                                                ...recetaEditData,
                                                indicaciones: e.target.value,
                                              })
                                            }
                                            placeholder="Ej: Cumplir el tratamiento indicado y asistir a control."
                                          />
                                        </div>

                                        <div className="acciones-editar-receta">
                                          <button
                                            type="button"
                                            className="btn-guardar-edicion-receta"
                                            onClick={guardarEdicionReceta}
                                          >
                                            💾 Guardar cambios
                                          </button>

                                          <button
                                            type="button"
                                            className="btn-cancelar-edicion-receta"
                                            onClick={cancelarEdicionReceta}
                                          >
                                            Cancelar
                                          </button>
                                        </div>
                                      </div>
                                    )}
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
                      No hay historial médico, tratamientos ni recetas registrados para este
                      paciente.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
                      setHistorialData({
                        ...historialData,
                        diagnostico: e.target.value,
                      })
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
                      setHistorialData({
                        ...historialData,
                        tratamiento: e.target.value,
                      })
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
                      setHistorialData({
                        ...historialData,
                        observaciones: e.target.value,
                      })
                    }
                    placeholder="Observaciones adicionales (opcional)"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Receta Médica</h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Medicamento</label>
                    <input
                      type="text"
                      name="medicamento"
                      value={detalleMedicamento.medicamento}
                      onChange={handleDetalleChange}
                      placeholder="Ej: Paracetamol 500 mg"
                    />
                  </div>

                  <div className="form-group">
                    <label>Dosis</label>
                    <input
                      type="text"
                      name="dosis"
                      value={detalleMedicamento.dosis}
                      onChange={handleDetalleChange}
                      placeholder="Ej: 1 tableta"
                    />
                  </div>

                  <div className="form-group">
                    <label>Frecuencia</label>
                    <input
                      type="text"
                      name="frecuencia"
                      value={detalleMedicamento.frecuencia}
                      onChange={handleDetalleChange}
                      placeholder="Ej: Cada 8 horas"
                    />
                  </div>

                  <div className="form-group">
                    <label>Duración</label>
                    <input
                      type="text"
                      name="duracion"
                      value={detalleMedicamento.duracion}
                      onChange={handleDetalleChange}
                      placeholder="Ej: 3 días"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Instrucciones</label>
                  <textarea
                    name="instrucciones"
                    value={detalleMedicamento.instrucciones}
                    onChange={handleDetalleChange}
                    placeholder="Ej: Tomar después de los alimentos"
                    rows="3"
                  />
                </div>

                <button
                  type="button"
                  className="btn-agregar-medicamento"
                  onClick={agregarMedicamento}
                >
                  + Agregar medicamento
                </button>

                {detallesReceta.length > 0 && (
                  <table className="tabla-medicamentos">
                    <thead>
                      <tr>
                        <th>Medicamento</th>
                        <th>Dosis</th>
                        <th>Frecuencia</th>
                        <th>Duración</th>
                        <th>Instrucciones</th>
                        <th>Acción</th>
                      </tr>
                    </thead>

                    <tbody>
                      {detallesReceta.map((detalle, index) => (
                        <tr key={index}>
                          <td>{detalle.medicamento}</td>
                          <td>{detalle.dosis}</td>
                          <td>{detalle.frecuencia}</td>
                          <td>{detalle.duracion}</td>
                          <td>{detalle.instrucciones}</td>
                          <td>
                            <button
                              type="button"
                              className="btn-eliminar-medicamento"
                              onClick={() => eliminarMedicamento(index)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="form-group">
                  <label>Indicaciones Generales</label>
                  <textarea
                    name="indicaciones"
                    rows="4"
                    value={recetaData.indicaciones}
                    onChange={(e) =>
                      setRecetaData({
                        ...recetaData,
                        indicaciones: e.target.value,
                      })
                    }
                    placeholder="Ej: Cumplir el tratamiento indicado y asistir a control."
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
                    limpiarFormulario()
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