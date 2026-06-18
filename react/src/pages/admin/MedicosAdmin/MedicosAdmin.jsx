import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { medicosAPI, especialidadesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './MedicosAdmin.css'

function MedicosAdmin() {
  const [medicos, setMedicos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingMedico, setEditingMedico] = useState(null)
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
      setError(err.response?.data?.error || 'Error al guardar el médico')
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
      setError(err.response?.data?.error || 'Error al dar de baja al médico')
    }
  }

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
          <button onClick={() => handleOpenModal()} className="btn-crear-medico">
            + Nuevo Médico
          </button>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">No hay médicos registrados</td>
                </tr>
              ) : (
                medicos.map((medico) => (
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

        {/* Modal para crear/editar */}
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

