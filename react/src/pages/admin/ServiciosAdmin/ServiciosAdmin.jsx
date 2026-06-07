import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { especialidadesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './ServiciosAdmin.css'

function ServiciosAdmin() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingServicio, setEditingServicio] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  })

  useEffect(() => {
    cargarServicios()
  }, [])

  const cargarServicios = async () => {
    setLoading(true)
    try {
      const response = await especialidadesAPI.getAll()
      setServicios(response?.data || response || [])
    } catch (err) {
      setError('Error al cargar los servicios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (servicio = null) => {
    if (servicio) {
      setEditingServicio(servicio)
      setFormData({
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
      })
    } else {
      setEditingServicio(null)
      setFormData({
        nombre: '',
        descripcion: '',
      })
    }
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingServicio(null)
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
      if (editingServicio) {
        await especialidadesAPI.update(editingServicio.idEspecialidad, formData)
        setSuccess('Servicio actualizado exitosamente')
      } else {
        await especialidadesAPI.create(formData)
        setSuccess('Servicio creado exitosamente')
      }

      await cargarServicios()
      setTimeout(() => {
        handleCloseModal()
        setSuccess('')
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el servicio')
    }
  }

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el servicio "${nombre}"?`)) {
      return
    }

    try {
      await especialidadesAPI.delete(id)
      setSuccess('Servicio eliminado exitosamente')
      await cargarServicios()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar el servicio')
    }
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="servicios-admin-container container">
          <div>Cargando servicios...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="servicios-admin-container container">
        <div className="admin-header-section">
          <h1>Gestión de Servicios (Especialidades)</h1>
          <button onClick={() => handleOpenModal()} className="btn-crear-servicio">
            + Nuevo Servicio
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="servicios-grid">
          {servicios.length === 0 ? (
            <div className="no-data">No hay servicios registrados</div>
          ) : (
            servicios.map((servicio) => (
              <div key={servicio.idEspecialidad} className="servicio-card">
                <div className="servicio-header">
                  <h3>{servicio.nombre}</h3>
                  <div className="servicio-actions">
                    <button
                      onClick={() => handleOpenModal(servicio)}
                      className="btn-edit"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(servicio.idEspecialidad, servicio.nombre)}
                      className="btn-delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="servicio-descripcion">{servicio.descripcion || 'Sin descripción'}</p>
                <div className="servicio-id">ID: {servicio.idEspecialidad}</div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
                <button className="btn-close-modal" onClick={handleCloseModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="servicio-form">
                <div className="form-group">
                  <label>Nombre del Servicio *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Cardiología"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Descripción del servicio..."
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal} className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {editingServicio ? 'Actualizar' : 'Crear'}
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

export default ServiciosAdmin

