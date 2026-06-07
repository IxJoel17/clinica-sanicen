import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { pacientesAPI, medicosAPI, especialidadesAPI } from '../../../services/api'
import { isMedico } from '../../../utils/roles'
import '../../../styles/common.css'
import './Perfil.css'

function Perfil() {
  const { user } = useAuth()
  const [showMessage, setShowMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [especialidades, setEspecialidades] = useState([])
  const esMedico = user && isMedico(user)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    sexo: '',
    fechaNacimiento: '',
    direccion: '',
    telefono: '',
    correo: '',
    nroHistoria: '',
    dni: '',
    idEspecialidad: '',
  })
  const [medicoId, setMedicoId] = useState(null)
  const [pacienteId, setPacienteId] = useState(null)

  useEffect(() => {
    if (user?.correo || user?.idUsuario) {
      cargarPerfil()
    }
  }, [user])

  useEffect(() => {
    if (esMedico) {
      cargarEspecialidades()
    }
  }, [esMedico])

  const cargarEspecialidades = async () => {
    try {
      const especialidadesData = await especialidadesAPI.getAll()
      setEspecialidades(especialidadesData?.data || especialidadesData || [])
    } catch (err) {
      console.error('Error cargando especialidades:', err)
    }
  }

  const cargarPerfil = async () => {
    setLoading(true)
    try {
      if (esMedico && user?.correo) {
        // Cargar datos del médico
        const medico = await medicosAPI.getByCorreo(user.correo)
        setMedicoId(medico.idMedico)
        setFormData({
          nombre: medico.nombre || '',
          apellido: medico.apellido || '',
          dni: medico.dni || '',
          direccion: medico.direccion || '',
          telefono: medico.telefono || '',
          correo: medico.correo || '',
          idEspecialidad: medico.especialidad?.idEspecialidad || '',
          sexo: '',
          fechaNacimiento: '',
          nroHistoria: '',
        })
      } else if (user?.correo) {
        let pacienteEncontrado = false
        try {
          const paciente = await pacientesAPI.getByCorreo(user.correo)
          pacienteEncontrado = true
          setPacienteId(paciente.idPaciente)
          setFormData({
            nombre: paciente.nombre || user.nombre || '',
            apellido: paciente.apellido || user.apellido || '',
            sexo: paciente.sexo || '',
            fechaNacimiento: paciente.fechaNacimiento || '',
            direccion: paciente.direccion || user.direccion || '',
            telefono: paciente.telefono || user.telefono || '',
            correo: paciente.correo || user.correo || '',
            nroHistoria: paciente.nroHistoria || '',
            dni: '',
            idEspecialidad: '',
          })
        } catch (err) {
          if (err.response?.status === 404 || !pacienteEncontrado) {
            console.log('Paciente no encontrado, usando datos del usuario')
            setPacienteId(null)
            setFormData({
              nombre: user.nombre || '',
              apellido: user.apellido || '',
              sexo: '',
              fechaNacimiento: '',
              direccion: user.direccion || '',
              telefono: user.telefono || '',
              correo: user.correo || '',
              nroHistoria: '',
              dni: '',
              idEspecialidad: '',
            })
          } else {
            throw err
          }
        }
      }
    } catch (err) {
      console.error('Error cargando perfil:', err)
      if (err.response?.status !== 404) {
        setError(
          esMedico
            ? 'Error al cargar el perfil. Puede que aún no tengas un perfil de médico asociado.'
            : 'Error al cargar el perfil.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setError('')
  }

  const handleGuardar = async () => {
    setError('')
    setSaving(true)

    try {
      if (esMedico && medicoId) {
        await medicosAPI.update(medicoId, formData)
      } else if (!esMedico) {
        const { nroHistoria, ...datosParaEnviar } = formData
        if (pacienteId) {
          await pacientesAPI.update(pacienteId, datosParaEnviar)
        } else {
          const nuevoPaciente = await pacientesAPI.create(datosParaEnviar)
          setPacienteId(nuevoPaciente.idPaciente)
          if (nuevoPaciente.nroHistoria) {
            setFormData(prev => ({ ...prev, nroHistoria: nuevoPaciente.nroHistoria }))
          }
        }
      }

      if (!esMedico && !pacienteId && user?.correo) {
        await cargarPerfil()
      }
      
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al guardar los cambios. Intenta nuevamente.')
      console.error('Error guardando perfil:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="profile-container">
          <div>Cargando perfil...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      {showMessage && (
        <div className="save-confirmation">✅ ¡Cambios guardados con éxito!</div>
      )}

      {error && (
        <div style={{ color: '#E8505B', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
          {error}
        </div>
      )}

      <div className="profile-container">
        <div className="header-main">
          <h1>{esMedico ? 'Perfil de Médico' : 'Perfil de Paciente'}</h1>
          <span className="user-info">
            {formData.nombre} {formData.apellido}
          </span>
        </div>

        <div className="profile-form-area">
          <div className="profile-left">
            <div className="profile-picture">{esMedico ? '👨‍⚕️' : '👤'}</div>

            {!esMedico && (
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="form-input"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                className="form-input"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>

            {esMedico && especialidades.length > 0 && (
              <div className="form-group">
                <label>Especialidad</label>
                <select
                  className="form-input"
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
            )}

            {!esMedico && (
              <div className="contact-emergency">
                <h3>Contacto de emergencia</h3>
                <p>{formData.telefono || '+98 765 432'}</p>
              </div>
            )}
          </div>

          <div className="profile-right">
            <div className="form-group">
              <label>Nombres</label>
              <input
                type="text"
                className="form-input"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Apellidos</label>
              <input
                type="text"
                className="form-input"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </div>

            {esMedico && (
              <div className="form-group">
                <label>DNI</label>
                <input
                  type="text"
                  className="form-input"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  maxLength="8"
                />
              </div>
            )}

            {!esMedico && (
              <>
                <div className="form-group">
                  <label>Número de Historia</label>
                  <input
                    type="text"
                    className="form-input"
                    name="nroHistoria"
                    value={formData.nroHistoria || 'Pendiente - Se generará al guardar'}
                    disabled
                    readOnly
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed', color: '#6c757d' }}
                  />
                </div>

                <div className="form-group radio-container">
                  <label>Género</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="sexo"
                        value="M"
                        checked={formData.sexo === 'M'}
                        onChange={handleChange}
                      />{' '}
                      Masculino
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="sexo"
                        value="F"
                        checked={formData.sexo === 'F'}
                        onChange={handleChange}
                      />{' '}
                      Femenino
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                className="form-input"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className="btn-contact"
              onClick={handleGuardar}
              disabled={saving}
            >
              {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  )
}

export default Perfil
