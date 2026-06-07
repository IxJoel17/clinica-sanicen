import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { usuariosAPI } from '../../../services/api'
import '../../../styles/common.css'
import './UsuariosAdmin.css'

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
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
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    setLoading(true)
    try {
      const response = await usuariosAPI.getAll()
      setUsuarios(response?.data || response || [])
    } catch (err) {
      setError('Error al cargar los usuarios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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
    setFormData({
      ...formData,
      [name]: value,
    })
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

      await cargarUsuarios()
      setTimeout(() => {
        handleCloseModal()
        setSuccess('')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el usuario')
    }
  }

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar al usuario ${nombre}?`)) {
      return
    }

    try {
      await usuariosAPI.delete(id)
      setSuccess('Usuario eliminado exitosamente')
      await cargarUsuarios()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el usuario')
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
          <button onClick={() => handleOpenModal()} className="btn-crear-usuario">
            + Nuevo Usuario
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="usuarios-table-container">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No hay usuarios registrados</td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.idUsuario}>
                    <td>{usuario.idUsuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.apellido}</td>
                    <td>{usuario.correo || 'N/A'}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>
                      <span className={`badge-rol rol-${usuario.rol}`}>{usuario.rol}</span>
                    </td>
                    <td>{formatFecha(usuario.fechaCreacion)}</td>
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
                          onClick={() => handleDelete(usuario.idUsuario, `${usuario.nombre} ${usuario.apellido}`)}
                          className="btn-delete"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
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

