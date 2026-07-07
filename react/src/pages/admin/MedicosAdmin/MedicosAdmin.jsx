import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { medicosAPI, especialidadesAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './MedicosAdmin.css'

function MedicosAdmin() {
  const [medicos, setMedicos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingMedico, setEditingMedico] = useState(null)

  const [showHorarioModal, setShowHorarioModal] = useState(false)
  const [medicoHorario, setMedicoHorario] = useState(null)
  const [citasMedico, setCitasMedico] = useState([])
  const [loadingHorario, setLoadingHorario] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    correo: '',
    direccion: '',
    idEspecialidad: '',
    activo: true,
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [medicosRes, especialidadesRes] = await Promise.all([
        medicosAPI.getAllIncludingInactive(),
        especialidadesAPI.getAll(),
      ])

      setMedicos(medicosRes?.data || medicosRes || [])
      setEspecialidades(especialidadesRes?.data || especialidadesRes || [])
    } catch (err) {
      setError('Error al cargar los datos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerHorario = async (medico) => {
    setMedicoHorario(medico)
    setShowHorarioModal(true)
    setLoadingHorario(true)
    setCitasMedico([])

    try {
      const response = await citasAPI.getByMedico(medico.idMedico)
      const citas = response?.citas || response?.data || response || []

      const citasOrdenadas = Array.isArray(citas)
        ? [...citas].sort((a, b) => {
            const fechaA = new Date(`${a.fecha}T${String(a.hora || '00:00').substring(0, 5)}`)
            const fechaB = new Date(`${b.fecha}T${String(b.hora || '00:00').substring(0, 5)}`)
            return fechaA - fechaB
          })
        : []

      setCitasMedico(citasOrdenadas)
    } catch (err) {
      console.error('Error cargando horario del médico:', err)
      setCitasMedico([])
    } finally {
      setLoadingHorario(false)
    }
  }

  const handleCerrarHorario = () => {
    setShowHorarioModal(false)
    setMedicoHorario(null)
    setCitasMedico([])
  }

  const handleOpenModal = (medico = null) => {
    if (medico) {
      setEditingMedico(medico)
      setFormData({
        nombre: medico.nombre || '',
        apellido: medico.apellido || '',
        dni: medico.dni || '',
        telefono: medico.telefono || '',
        correo: medico.correo || '',
        direccion: medico.direccion || '',
        idEspecialidad: medico.especialidad?.idEspecialidad || '',
        activo: medico.activo !== undefined ? medico.activo : true,
      })
    } else {
      setEditingMedico(null)
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: '',
        correo: '',
        direccion: '',
        idEspecialidad: '',
        activo: true,
      })
    }

    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingMedico(null)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const medicoData = {
        ...formData,
        idEspecialidad: formData.idEspecialidad ? parseInt(formData.idEspecialidad) : null,
      }

      if (editingMedico) {
        await medicosAPI.update(editingMedico.idMedico, medicoData)
        setSuccess('Médico actualizado exitosamente')
      } else {
        await medicosAPI.create(medicoData)
        setSuccess('Médico creado exitosamente')
      }

      await cargarDatos()

      setTimeout(() => {
        handleCloseModal()
        setSuccess('')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar el médico')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea dar de baja a este médico?')) {
      return
    }

    try {
      await medicosAPI.delete(id)
      setSuccess('Médico dado de baja exitosamente')
      await cargarDatos()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al dar de baja al médico')
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A'

    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return String(hora).substring(0, 5)
  }

  const obtenerNombrePaciente = (cita) => {
    if (cita.paciente) {
      return `${cita.paciente.nombre || ''} ${cita.paciente.apellido || ''}`.trim()
    }

    return cita.nombrePaciente || cita.pacienteNombre || 'Paciente no registrado'
  }

  const obtenerClaseEstado = (estado) => {
    const estadoNormalizado = String(estado || '').toLowerCase()

    if (estadoNormalizado === 'completada') return 'horario-estado completada'
    if (estadoNormalizado === 'pendiente') return 'horario-estado pendiente'
    if (estadoNormalizado === 'programada') return 'horario-estado programada'
    if (estadoNormalizado === 'cancelada') return 'horario-estado cancelada'

    return 'horario-estado'
  }

  const medicosFiltrados = medicos.filter((medico) => {
    const texto = busqueda.toLowerCase().trim()

    if (!texto) return true

    return (
      String(medico.idMedico || '').toLowerCase().includes(texto) ||
      String(medico.nombre || '').toLowerCase().includes(texto) ||
      String(medico.apellido || '').toLowerCase().includes(texto) ||
      String(medico.dni || '').toLowerCase().includes(texto) ||
      String(medico.telefono || '').toLowerCase().includes(texto) ||
      String(medico.correo || '').toLowerCase().includes(texto) ||
      String(medico.especialidad?.nombre || '').toLowerCase().includes(texto)
    )
  })

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="medicos-admin-container container">
          <div>Cargando médicos...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="medicos-admin-container container">
        <div className="admin-header-section">
          <h1>Gestion de médicos</h1>

          <div className="medicos-header-actions">
            <input
              type="text"
              className="input-buscar-medico"
              placeholder="Buscar por nombre, DNI, correo o especialidad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <button onClick={() => handleOpenModal()} className="btn-crear-medico">
              + Nuevo Médico
            </button>
          </div>
        </div>

        <div className="medicos-resultados">
          Mostrando {medicosFiltrados.length} de {medicos.length} médicos
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="medicos-table-container">
          <table className="medicos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Horario</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {medicosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    No se encontraron médicos
                  </td>
                </tr>
              ) : (
                medicosFiltrados.map((medico) => (
                  <tr key={medico.idMedico} className={!medico.activo ? 'inactive' : ''}>
                    <td>{medico.idMedico}</td>
                    <td>{medico.nombre}</td>
                    <td>{medico.apellido}</td>
                    <td>{medico.dni}</td>
                    <td>{medico.especialidad?.nombre || 'Sin especialidad'}</td>
                    <td>{medico.telefono}</td>
                    <td>{medico.correo}</td>
                    <td>{medico.activo ? 'Activo' : 'Inactivo'}</td>

                    <td>
                      <button
                        className="btn-horario-medico"
                        onClick={() => handleVerHorario(medico)}
                        title="Ver horario del médico"
                      >
                        📅 Ver horario
                      </button>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleOpenModal(medico)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>

                        {medico.activo && (
                          <button
                            onClick={() => handleDelete(medico.idMedico)}
                            className="btn-delete"
                            title="Dar de baja"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showHorarioModal && medicoHorario && (
          <div className="modal-overlay" onClick={handleCerrarHorario}>
            <div className="modal-content horario-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  Horario del Dr(a). {medicoHorario.nombre} {medicoHorario.apellido}
                </h2>

                <button className="btn-close-modal" onClick={handleCerrarHorario}>
                  ×
                </button>
              </div>

              <button className="btn-volver-horario" onClick={handleCerrarHorario}>
                ← Volver
              </button>

              <div className="horario-info-medico">
                <p>
                  <strong>Especialidad:</strong>{' '}
                  {medicoHorario.especialidad?.nombre || 'Sin especialidad'}
                </p>
                <p>
                  <strong>Correo:</strong> {medicoHorario.correo || 'N/A'}
                </p>
                <p>
                  <strong>Teléfono:</strong> {medicoHorario.telefono || 'N/A'}
                </p>
              </div>

              <div className="horario-resumen-grid">
                <div className="horario-resumen-card">
                  <strong>{citasMedico.length}</strong>
                  <span>Citas registradas</span>
                </div>

                <div className="horario-resumen-card">
                  <strong>
                    {citasMedico.filter((c) => c.estado === 'pendiente').length}
                  </strong>
                  <span>Pendientes</span>
                </div>

                <div className="horario-resumen-card">
                  <strong>
                    {citasMedico.filter((c) => c.estado === 'programada').length}
                  </strong>
                  <span>Programadas</span>
                </div>

                <div className="horario-resumen-card">
                  <strong>
                    {citasMedico.filter((c) => c.estado === 'completada').length}
                  </strong>
                  <span>Completadas</span>
                </div>
              </div>

              <h3>Citas asignadas</h3>

              {loadingHorario ? (
                <p>Cargando horario...</p>
              ) : citasMedico.length === 0 ? (
                <p>No tiene citas registradas.</p>
              ) : (
                <div className="horario-lista">
                  {citasMedico.map((cita) => (
                    <div key={cita.idCita} className="horario-card">
                      <div className="horario-card-top">
                        <strong>
                          {formatFecha(cita.fecha)} - {formatHora(cita.hora)}
                        </strong>

                        <span className={obtenerClaseEstado(cita.estado)}>
                          {cita.estado || 'Sin estado'}
                        </span>
                      </div>

                      <p>
                        <strong>Paciente:</strong> {obtenerNombrePaciente(cita)}
                      </p>
                      <p>
                        <strong>Motivo:</strong> {cita.motivo || 'Consulta médica'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <h3>Descansos</h3>

              <div className="horario-descansos">
                <p>☕ 12:00 PM - 02:00 PM | Descanso de almuerzo</p>
                <p>🕕 Después de 06:00 PM | Fin de atención</p>
                <p>📌 Domingo | Sin atención programada</p>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingMedico ? 'Editar Médico' : 'Nuevo Médico'}</h2>
                <button className="btn-close-modal" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="medico-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>DNI</label>
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      maxLength="8"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Especialidad</label>
                    <select
                      name="idEspecialidad"
                      value={formData.idEspecialidad}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione una especialidad</option>
                      {especialidades.map((esp) => (
                        <option key={esp.idEspecialidad} value={esp.idEspecialidad}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                      />
                      {' '}Activo
                    </label>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal} className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {editingMedico ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default MedicosAdmin
