import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { usuariosAPI, medicosAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './UsuariosAdmin.css'

function UsuariosAdmin() {
  const { user } = useAuth()
  const esAdmin = user?.rol === 'administrador'

  const [usuarios, setUsuarios] = useState([])
  const [medicos, setMedicos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)

  const [showHorarioModal, setShowHorarioModal] = useState(false)
  const [medicoHorario, setMedicoHorario] = useState(null)
  const [citasMedico, setCitasMedico] = useState([])

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    correo: '',
    rol: 'paciente',
  })

  const roles = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'medico', label: 'Médico' },
    { value: 'paciente', label: 'Paciente' },
    { value: 'recepcionista', label: 'Recepcionista' },
    { value: 'farmaceutico', label: 'Farmacéutico' },
  ]

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const usuariosData = await usuariosAPI.getAll()
      const medicosData = await medicosAPI.getAll()

      setUsuarios(usuariosData?.data || usuariosData || [])
      setMedicos(medicosData?.data || medicosData || [])
    } catch (err) {
      setError('Error al cargar los datos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const buscarMedicoPorUsuario = (usuario) => {
    return medicos.find(
      (medico) =>
        medico.correo?.toLowerCase() === usuario.correo?.toLowerCase() ||
        (
          medico.nombre?.toLowerCase() === usuario.nombre?.toLowerCase() &&
          medico.apellido?.toLowerCase() === usuario.apellido?.toLowerCase()
        )
    )
  }

  const handleVerHorario = async (usuario) => {
    const medico = buscarMedicoPorUsuario(usuario)

    if (!medico) {
      alert('No se encontró el registro médico asociado a este usuario.')
      return
    }

    setMedicoHorario(medico)
    setShowHorarioModal(true)

    try {
      const response = await citasAPI.getByMedico(medico.idMedico)
      const citas = response?.citas || response?.data || response || []
      setCitasMedico(Array.isArray(citas) ? citas : [])
    } catch (err) {
      console.error('Error cargando citas del médico:', err)
      setCitasMedico([])
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const texto = busqueda.toLowerCase().trim()
    if (!texto) return true

    return (
      String(usuario.idUsuario || '').toLowerCase().includes(texto) ||
      String(usuario.usuario || '').toLowerCase().includes(texto) ||
      String(usuario.nombre || '').toLowerCase().includes(texto) ||
      String(usuario.apellido || '').toLowerCase().includes(texto) ||
      String(usuario.correo || '').toLowerCase().includes(texto) ||
      String(usuario.telefono || '').toLowerCase().includes(texto) ||
      String(usuario.rol || '').toLowerCase().includes(texto) ||
      String(usuario.dni || '').toLowerCase().includes(texto)
    )
  })

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUsuario(usuario)
      setFormData({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        direccion: usuario.direccion || '',
        telefono: usuario.telefono || '',
        correo: usuario.correo || '',
        rol: usuario.rol || 'paciente',
      })
    } else {
      setEditingUsuario(null)
      setFormData({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        correo: '',
        rol: 'paciente',
      })
    }

    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUsuario(null)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingUsuario) {
        await usuariosAPI.update(editingUsuario.idUsuario, formData)
        setSuccess('Usuario actualizado exitosamente')
      } else {
        await usuariosAPI.create(formData)
        setSuccess('Usuario creado exitosamente')
      }

      await cargarDatos()

      setTimeout(() => {
        handleCloseModal()
        setSuccess('')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar el usuario')
    }
  }

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar al usuario ${nombre}?`)) return

    try {
      await usuariosAPI.delete(id)
      setSuccess('Usuario eliminado exitosamente')
      await cargarDatos()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al eliminar el usuario')
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A'
    return new Date(fecha).toLocaleDateString('es-ES')
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return String(hora).substring(0, 5)
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="usuarios-admin-container container">
          <div>Cargando usuarios...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="usuarios-admin-container container">
        <div className="admin-header-section">
          <h1>Gestión de Usuarios</h1>

          <div className="usuarios-header-actions">
            <input
              type="text"
              className="input-buscar-usuario"
              placeholder="Buscar por nombre, usuario, correo, rol o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {esAdmin && (
              <button onClick={() => handleOpenModal()} className="btn-crear-usuario">
                + Nuevo Usuario
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="usuarios-resultados">
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </div>

        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                {esAdmin && <th>Usuario</th>}
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Fecha Creación</th>
                <th>Horario</th>
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={esAdmin ? 10 : 8} className="no-data">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.idUsuario}>
                    <td>{usuario.idUsuario}</td>

                    {esAdmin && <td>{usuario.usuario || 'Sin usuario'}</td>}

                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.correo || 'N/A'}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>
                      <span className={`badge-rol rol-${usuario.rol}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td>{formatFecha(usuario.fechaCreacion)}</td>

                    <td>
                      {usuario.rol === 'medico' ? (
                        <button
                          className="btn-horario"
                          onClick={() => handleVerHorario(usuario)}
                        >
                          📅 Ver
                        </button>
                      ) : (
                        <span className="sin-horario">No aplica</span>
                      )}
                    </td>

                    {esAdmin && (
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleOpenModal(usuario)}
                            className="btn-edit"
                            title="Editar"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                usuario.idUsuario,
                                `${usuario.nombre} ${usuario.apellido}`
                              )
                            }
                            className="btn-delete"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showHorarioModal && medicoHorario && (
          <div className="modal-overlay" onClick={() => setShowHorarioModal(false)}>
            <div className="modal-content horario-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  Horario del Dr(a). {medicoHorario.nombre} {medicoHorario.apellido}
                </h2>

                <button
                  className="btn-close-modal"
                  onClick={() => setShowHorarioModal(false)}
                >
                  ×
                </button>
              </div>

              <button
                className="btn-volver-horario"
                onClick={() => setShowHorarioModal(false)}
              >
                ← Volver
              </button>

              <div className="horario-info-medico">
                <p><strong>Correo:</strong> {medicoHorario.correo || 'N/A'}</p>
                <p><strong>Especialidad:</strong> {medicoHorario.especialidad?.nombre || medicoHorario.especialidad || 'No registrada'}</p>
              </div>

              <h3>Citas asignadas</h3>

              {citasMedico.length === 0 ? (
                <p>No tiene citas registradas.</p>
              ) : (
                <div className="horario-lista">
                  {citasMedico.map((cita) => (
                    <div key={cita.idCita} className="horario-card">
                      <strong>
                        {formatFecha(cita.fecha)} - {formatHora(cita.hora)}
                      </strong>
                      <p>
                        <strong>Paciente:</strong>{' '}
                        {cita.paciente?.nombre} {cita.paciente?.apellido}
                      </p>
                      <p><strong>Estado:</strong> {cita.estado}</p>
                      <p><strong>Motivo:</strong> {cita.motivo || 'Consulta médica'}</p>
                    </div>
                  ))}
                </div>
              )}

              <h3>Descansos</h3>

              <div className="horario-descansos">
                <p>☕ 12:00 PM - 02:00 PM | Descanso de almuerzo</p>
                <p>🕕 Después de 06:00 PM | Fin de atención</p>
              </div>
            </div>
          </div>
        )}

        {showModal && esAdmin && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button className="btn-close-modal" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="usuario-form">
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
                    <label>Correo</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
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
                  <label>Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rol *</label>
                  <select name="rol" value={formData.rol} onChange={handleChange} required>
                    {roles.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal} className="btn-cancel">
                    Cancelar
                  </button>

                  <button type="submit" className="btn-save">
                    {editingUsuario ? 'Actualizar' : 'Crear'}
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

export default UsuariosAdmin