import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBlue from '../../../components/HeaderBlue'
import '../../../styles/common.css'
import './RecuperarPaso1.css'

function RecuperarPaso1() {
  const navigate = useNavigate()

  const [metodo, setMetodo] = useState('correo')   // 'correo' | 'sms'
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [codigoCorrecto, setCodigoCorrecto] = useState('')
  const [codigoIngresado, setCodigoIngresado] = useState('')
  const [mostrarError, setMostrarError] = useState(false)

  // VALIDAR EMAIL (formato y dominio)
  const validarCorreo = (correo) => {
    const regex =
      /^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|utp\.edu\.pe|live\.com)$/i
    return regex.test(correo)
  }

  // VALIDAR TELÉFONO (ej: 9 dígitos)
  const validarTelefono = (cel) => {
    const soloNumeros = cel.replace(/[^0-9]/g, '')
    // Perú: 9 dígitos típicos de celular
    return /^[0-9]{9}$/.test(soloNumeros)
  }

  // ENVIAR CÓDIGO
  const enviarCodigo = async () => {
    try {
      // ====================
      // MÉTODO: CORREO
      // ====================
      if (metodo === 'correo') {
        if (email.trim() === '') {
          alert('Por favor ingresa tu correo.')
          return
        }

        if (!validarCorreo(email)) {
          alert('Correo inválido. Usa un correo válido como gmail.com, hotmail.com, outlook.com, etc.')
          return
        }

        // Verificar en el backend si el correo existe
        const resp = await fetch(
          `http://localhost:8080/api/auth/check-email?correo=${encodeURIComponent(email)}`
        )
        const existe = await resp.json()

        if (!existe) {
          alert('El correo no está registrado en la base de datos.')
          return
        }

        // Si todo ok → generar código
        const codigo = Math.floor(100000 + Math.random() * 900000).toString()
        setCodigoCorrecto(codigo)
        setMostrarError(false)
        setCodigoIngresado('')

        // Aquí simulas envío real de correo
        alert(`Código enviado a: ${email}\n(Código solo de prueba: ${codigo})`)
      }

      // ====================
      // MÉTODO: SMS
      // ====================
      if (metodo === 'sms') {
        const celLimpio = telefono.replace(/[^0-9]/g, '') // solo números

        if (celLimpio === '') {
          alert('Por favor ingresa tu número de celular.')
          return
        }

        if (celLimpio.length !== 9) {
          alert('El número de celular debe tener exactamente 9 dígitos.')
          return
        }

        if (!validarTelefono(celLimpio)) {
          alert('Número de celular inválido. Debe tener 9 dígitos.')
          return
        }

        // Verificación de número de celular con el backend
        const resp = await fetch(
          `http://localhost:8080/api/auth/check-phone?telefono=${encodeURIComponent(celLimpio)}`
        )
        const existe = await resp.json()

        if (!existe) {
          alert('El número no está registrado en la base de datos.')
          return
        }

        // Simulación de verificación OK + envío de SMS
        const codigo = Math.floor(100000 + Math.random() * 900000).toString()
        setCodigoCorrecto(codigo)
        setMostrarError(false)
        setCodigoIngresado('')

        // Aquí simulas el SMS real (en producción usarías Twilio u otro servicio)
        alert(`Código enviado por SMS al número: ${celLimpio}\n(Código solo de prueba: ${codigo})`)
      }
    } catch (error) {
      console.error(error)
      alert('Error al verificar los datos.')
    }
  }

  // VERIFICAR CÓDIGO
  const verificarCodigo = (e) => {
    e.preventDefault()

    if (codigoIngresado.trim() === codigoCorrecto && codigoCorrecto !== '') {
      // ➜ PASO 2, con el correo incluido (si se usó correo)
      //    si se usó SMS, igual puedes pasar el correo luego al buscarlo por teléfono en backend
      navigate('/recuperar-paso2', {
        state: {
          email: metodo === 'correo' ? email : null,
          metodo,
        },
      })
    } else {
      setMostrarError(true)
    }
  }

  // Validación en tiempo real para que solo se puedan ingresar números en el teléfono
  const handleTelefonoChange = (e) => {
    const soloNumeros = e.target.value.replace(/[^0-9]/g, '') // solo números
    if (soloNumeros.length <= 9) {
      setTelefono(soloNumeros)
    }
  }

  return (
    <div className="recovery-layout">
      <HeaderBlue />
      <div className="recovery-container">
        <div className="recovery-card">
          <h2>Recuperar contraseña</h2>

          {/* SELECCIÓN DE MÉTODO */}
          <div className="metodo-recuperacion">
            <label>
              <input
                type="radio"
                value="correo"
                checked={metodo === 'correo'}
                onChange={() => setMetodo('correo')}
              />
              &nbsp;Por correo electrónico
            </label>
            
            <label>
              <input
                type="radio"
                value="sms"
                checked={metodo === 'sms'}
                onChange={() => setMetodo('sms')}
              />
              &nbsp;Por SMS (celular)
            </label>
          </div>

          {/* Correo */}
          {metodo === 'correo' && (
            <>
              <div className="tooltip-input-wrapper">
                <input
                  type="email"
                  className="custom-input tooltip-input-p1"
                  placeholder="ejemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="tooltip-text-input-p1">
                  debe llevar:
                  <br />
                  <strong>@</strong>
                </span>
              </div>
            </>
          )}

          {/* Teléfono */}
          {metodo === 'sms' && (
            <>
              
              <input
                type="tel"
                className="custom-input"
                placeholder="ej: 987654321"
                value={telefono}
                onChange={handleTelefonoChange}
              />
            </>
          )}

          <button className="btn-verify" type="button" onClick={enviarCodigo}>
            Enviar código
          </button>

          {/* Código */}
          <form onSubmit={verificarCodigo}>
            <label>Ingresa el código enviado</label>
            <input
              type="text"
              maxLength={6}
              className="custom-input"
              placeholder="******"
              value={codigoIngresado}
              onChange={(e) => setCodigoIngresado(e.target.value)}
              required
            />

            <button type="submit" className="btn-verify">
              Verificar código
            </button>

            {mostrarError && <p className="error-msg">❌ Código incorrecto</p>}
          </form>

          <div className="step-indicators">
            <span className="active"></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecuperarPaso1
