import { useState } from 'react'
import sanicenImg from '../../../assets/img/sanicensesion.jpg';
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Regla:
  // - Paciente: solo números (ej: 12345) máx 8 dígitos
  // - Admin: C + números   (ej: C123)   máx 7 caracteres
  // - Médico: J + números  (ej: J456)   máx 7 caracteres
  // - Recepcionista: U + números  (ej: U456)   máx 7 caracteres
  const esUsuarioValido = (usuario) => {
    if (!usuario) return false

    const regexPaciente = /^[0-9]{1,8}$/        // 1-8 dígitos
    const regexAdmin = /^C[0-9]{1,6}$/i         // C + 1-6 dígitos (total máx 7)
    const regexMedico = /^J[0-9]{1,6}$/i        // J + 1-6 dígitos (total máx 7)
    const regexRecepcionista = /^U[0-9]{1,6}$/i // U + 1-6 dígitos

    return (
      regexPaciente.test(usuario) ||
      regexAdmin.test(usuario) ||
      regexMedico.test(usuario) ||
      regexRecepcionista.test(usuario)
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'usuario') {
      let nuevo = value.toUpperCase()

      // vacío → resetea
      if (nuevo.length === 0) {
        setFormData({ ...formData, usuario: '' })
        setError('')
        return
      }

      const primera = nuevo[0]

      // ADMIN / MEDICO / RECEPCIONISTA: C, J o U+ solo números, máx 7 caracteres
      if (primera === 'C' || primera === 'J' || primera === 'U') {
        let soloNumeros = nuevo.slice(1).replace(/[^0-9]/g, '')
        soloNumeros = soloNumeros.slice(0, 6) // máx 6 dígitos
        nuevo = primera + soloNumeros
      } else {
        // PACIENTE: solo números, máx 8 dígitos
        nuevo = nuevo.replace(/[^0-9]/g, '')
        nuevo = nuevo.slice(0, 8)
      }

      setFormData({
        ...formData,
        usuario: nuevo,
      })
      setError('')
      return
    }

    // Para la contraseña u otros campos
    setFormData({
      ...formData,
      [name]: value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validar usuario antes de llamar al backend
    if (!esUsuarioValido(formData.usuario)) {
      setError(
        'Usuario inválido. Paciente: solo números (máx 8). Admin: C + números. Médico: J + números. Recepcionista: U + números.'
      )
      setLoading(false)
      return
    }

    try {
      await login(formData.usuario.trim().toUpperCase(), formData.contrasena.trim())

const primeraLetra = formData.usuario.charAt(0).toUpperCase()

  if (primeraLetra === 'C') {
    navigate('/portal-admin')
  } else if (primeraLetra === 'J') {
    navigate('/portal-medico')
  } else if (primeraLetra === 'U') {
    navigate('/portal-recepcionista')
  } else {
    navigate('/portal')
  }
      } catch (err) {
        setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
        console.error('Error en login:', err)
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="login-wrapper">
      <div
    className="login-left"
    style={{
    backgroundImage: `url(${sanicenImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    }}
    ></div>


      <div className="login-right">
        <div className="login-content">
          
          <h1>Iniciar Sesión</h1>
          <p className="subtitle">Bienvenido de nuevo a tu portal de salud</p>

          {error && (
            <div
              className="error-message"
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
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="usuario"
              placeholder="ej: 12345 / C*** / J*** / U***"
              value={formData.usuario}
              onChange={handleChange}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="contrasena"
              placeholder="********"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿Aún no tienes cuenta?{' '}
              <Link to="/registro" className="enlace-registro">
                REGISTRATE
              </Link>
            </p>
            <p>
              ¿Olvidaste tu contraseña?{' '}
              <Link to="/recuperar-paso1">RECUPÉRALO</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login