import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { medicosAPI, citasAPI } from '../../../services/api'
import '../../../styles/common.css'
import './PacientesMedico.css'

function PacientesMedico() {
  const { user } = useAuth()
  const [medicoInfo, setMedicoInfo] = useState(null)
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user?.correo) {
      cargarPacientes()
    }
  }, [user])

  const cargarPacientes = async () => {
    setLoading(true)
    try {
      const medico = await medicosAPI.getByCorreo(user.correo)
      setMedicoInfo(medico)

      if (medico.idMedico) {
        const citasData = await citasAPI.getByMedico(medico.idMedico)
        const citas = citasData?.citas || citasData || []

        const pacientesMap = new Map()

        citas.forEach((cita) => {
          if (cita.paciente) {
            const idPaciente = cita.paciente.idPaciente
            if (!pacientesMap.has(idPaciente)) {
              const citasDelPaciente = citas.filter((c) => c.paciente?.idPaciente === idPaciente)
              const ultimaCita = citasDelPaciente
                .sort((a, b) => {
                  const fechaA = new Date(`${a.fecha}T${a.hora}`)
                  const fechaB = new Date(`${b.fecha}T${b.hora}`)
                  return fechaB - fechaA
                })[0]

              const estaActivo =
                ultimaCita &&
                (ultimaCita.estado === 'completada' ||
                  ultimaCita.estado === 'confirmada' ||
                  ultimaCita.estado === 'programada' ||
                  ultimaCita.estado === 'pendiente')

              pacientesMap.set(idPaciente, {
                ...cita.paciente,
                estaActivo,
                ultimaCita: ultimaCita ? `${ultimaCita.fecha} ${ultimaCita.hora}` : null,
                totalCitas: citasDelPaciente.length,
              })
            }
          }
        })

        const pacientesArray = Array.from(pacientesMap.values()).sort((a, b) => {
          const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase()
          const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase()
          return nombreA.localeCompare(nombreB)
        })

        setPacientes(pacientesArray)
      }
    } catch (err) {
      console.error('Error cargando pacientes:', err)
      setError('Error al cargar los pacientes')
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
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

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const search = searchTerm.toLowerCase()
    return (
      paciente.nombre?.toLowerCase().includes(search) ||
      paciente.apellido?.toLowerCase().includes(search) ||
      paciente.nroHistoria?.toLowerCase().includes(search) ||
      paciente.correo?.toLowerCase().includes(search)
    )
  })

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="pacientes-medico-container container">
          <div>Cargando pacientes...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="pacientes-medico-container container">
        <div className="pacientes-medico-header">
          <h1>Mis Pacientes</h1>
          {medicoInfo && (
            <p className="medico-nombre">
              {medicoInfo.nombre} {medicoInfo.apellido}
              {medicoInfo.especialidad && ` - ${medicoInfo.especialidad.nombre}`}
            </p>
          )}
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, número de historia o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="pacientes-count">
          Total de pacientes atendidos: {pacientesFiltrados.length}
        </div>

        <div className="pacientes-grid">
          {pacientesFiltrados.length === 0 ? (
            <div className="no-data">
              {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
            </div>
          ) : (
            pacientesFiltrados.map((paciente) => (
              <div key={paciente.idPaciente} className="paciente-card">
                <div className="paciente-card-header">
                  <h3>
                    {paciente.nombre} {paciente.apellido}
                  </h3>
                  <span className={`estado-badge ${paciente.estaActivo ? 'activo' : 'inactivo'}`}>
                    {paciente.estaActivo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="paciente-card-body">
                  {paciente.nroHistoria && (
                    <div className="paciente-info-item">
                      <strong>Nro. Historia:</strong>
                      <span>{paciente.nroHistoria}</span>
                    </div>
                  )}
                  {paciente.telefono && (
                    <div className="paciente-info-item">
                      <strong>Teléfono:</strong>
                      <span>{paciente.telefono}</span>
                    </div>
                  )}
                  {paciente.correo && (
                    <div className="paciente-info-item">
                      <strong>Correo:</strong>
                      <span>{paciente.correo}</span>
                    </div>
                  )}
                  <div className="paciente-info-item">
                    <strong>Total de Citas:</strong>
                    <span>{paciente.totalCitas}</span>
                  </div>
                  {paciente.ultimaCita && (
                    <div className="paciente-info-item">
                      <strong>Última Cita:</strong>
                      <span>{formatFecha(paciente.ultimaCita)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default PacientesMedico

