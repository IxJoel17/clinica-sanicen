import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { pacientesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './PacientesAdmin.css'

function PacientesAdmin() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    cargarPacientes()
  }, [])

  const cargarPacientes = async () => {
    setLoading(true)
    try {
      const response = await pacientesAPI.getAll()
      setPacientes(response?.data || response || [])
    } catch (err) {
      setError('Error al cargar los pacientes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Está seguro de que desea dar de baja al paciente ${nombre}?`)) {
      return
    }

    try {
      await pacientesAPI.delete(id)
      setSuccess('Paciente dado de baja exitosamente')
      await cargarPacientes()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al dar de baja al paciente')
      setTimeout(() => setError(''), 5000)
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

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const search = searchTerm.toLowerCase()
    return (
      paciente.nombre?.toLowerCase().includes(search) ||
      paciente.apellido?.toLowerCase().includes(search) ||
      paciente.correo?.toLowerCase().includes(search) ||
      paciente.nroHistoria?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="pacientes-admin-container container">
          <div>Cargando pacientes...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="pacientes-admin-container container">
        <div className="admin-header-section">
          <h1>Gestión de Pacientes</h1>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, correo o número de historia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="pacientes-count">
          Total de pacientes: {pacientesFiltrados.length}
        </div>

        <div className="pacientes-table-container">
          <table className="pacientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nro. Historia</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Sexo</th>
                <th>Fecha Nacimiento</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">
                    {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.idPaciente}>
                    <td>{paciente.idPaciente}</td>
                    <td>{paciente.nroHistoria || 'N/A'}</td>
                    <td>{paciente.nombre}</td>
                    <td>{paciente.apellido}</td>
                    <td>{paciente.sexo || 'N/A'}</td>
                    <td>{formatFecha(paciente.fechaNacimiento)}</td>
                    <td>{paciente.telefono || 'N/A'}</td>
                    <td>{paciente.correo || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleDelete(paciente.idPaciente, `${paciente.nombre} ${paciente.apellido}`)
                        }
                        className="btn-delete"
                        title="Dar de baja"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default PacientesAdmin

