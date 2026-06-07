import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import '../../../styles/common.css'
import './Registro.css'

function Registro() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    correo: '',
    rol: 'paciente',
    nombreUsuario: '',  // acá se guardará el DNI para login
    contrasena: '',
    dni: '',            // nuevo campo solo para el form
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  // ✅ Solo números, máx 8 dígitos y sincronizar con nombreUsuario
  const handleDniChange = (e) => {
    let value = e.target.value

    // Solo números
    value = value.replace(/\D/g, '')

    // Máx 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8)
    }

    setFormData((prev) => ({
      ...prev,
      dni: value,
      nombreUsuario: value, // el backend usará esto como usuario
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Nos aseguramos de que nombreUsuario tenga el DNI
      const payload = {
        ...formData,
        nombreUsuario: formData.nombreUsuario || formData.dni,
      }

      await authAPI.register(payload)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al registrar usuario. Intenta nuevamente.')
      console.error('Error en registro:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen-center">
      <div className="register-wrapper">
        <div className="header-top">
          <div className="logo">
            <h2 style={{ color: '#e8505b' }}>
              CLINICA <span style={{ color: '#2d9cdb' }}>SANICEN</span>
            </h2>
          </div>
          <div className="maroon-bar"></div>
        </div>

        <div className="content-area">
          <div className="left-icon-box">
            <span className="hospital-icon">🏥</span>
          </div>

          <div className="form-section">
            <h1 className="title-outline">REGISTRO</h1>

            <img
              src="https://cdn-icons-png.flaticon.com/512/3209/3209054.png"
              alt="Doctores"
              className="doctors-img"
              style={{ opacity: 0.8 }}
            />

            {success && (
              <div
                style={{
                  color: '#2D9CDB',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#e6f3ff',
                  borderRadius: '5px',
                }}
              >
                ✅ Usuario registrado correctamente. Redirigiendo...
              </div>
            )}

            {error && (
              <div
                style={{
                  color: '#E8505B',
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#ffe6e6',
                  borderRadius: '5px',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="custom-input"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  className="custom-input"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  className="custom-input"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  className="custom-input"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength={9}
                />
              </div>

              <div className="input-group">
                <label>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  className="custom-input"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>DNI</label>
                <input
                  type="text"
                  name="dni"
                  className="custom-input"
                  value={formData.dni}
                  onChange={handleDniChange}
                  maxLength={8}
                  required
                />
              </div>

              <div className="input-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  className="custom-input"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="terms">
                <label>
                  <input type="checkbox" required /> Aceptar términos y condiciones
                </label>
              </div>

              <div className="button-row">
                <Link to="/login" className="btn-action">
                  CANCELAR
                </Link>
                <button type="submit" className="btn-action" disabled={loading}>
                  {loading ? 'REGISTRANDO...' : 'REGISTRAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registro