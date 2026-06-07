import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HeaderBlue from '../../../components/HeaderBlue'
import '../../../styles/common.css'
import './RecuperarPaso2.css'

function RecuperarPaso2() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email

  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mensaje, setMensaje] = useState('')

  // VALIDACIÓN DE CONTRASEÑA (mínimo 6 caracteres y 1 número)
  const validarPassword = (pass) => {
    const regex = /^(?=.*\d).{6,}$/ // al menos 1 número y 6 caracteres
    return regex.test(pass)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarPassword(password)) {
      setMensaje('La contraseña debe tener mínimo 6 caracteres y al menos un número.')
      return
    }

    if (password !== confirmar) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }

    if (!email) {
      setMensaje('Error: no se recibió el correo del usuario.')
      return
    }

    try {
      const resp = await fetch('http://localhost:8080/api/auth/reset-password-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          nuevaContrasena: password,
        }),
      })

      if (!resp.ok) {
        setMensaje('Error al actualizar la contraseña.')
        return
      }

      setMensaje('Contraseña actualizada correctamente.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      console.error(error)
      setMensaje('Error de conexión con el servidor.')
    }
  }

  return (
    <div className="recovery-layout">
      <HeaderBlue />
      <div className="recovery-container">
        <div className="recovery-card">
          <div className="lock-icon">Nueva contraseña 🔒</div>

          <form onSubmit={handleSubmit}>
            {/* INPUT CON TOOLTIP */}
            <div className="tooltip-input-wrapper">
              <label className="line-input-label">Ingresa Contraseña Nueva</label>

              <input
                type="password"
                className="line-input tooltip-input"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* TOOLTIP FLOTANTE */}
              <span className="tooltip-text-input-p2">
                Debe contener:
                <br />
                • Mínimo 6 caracteres
                <br />
                • Al menos 1 número
              </span>
            </div>

            {/* CONFIRMACIÓN */}
            <div className="input-group">
              <label className="line-input-label">Confirma Contraseña Nueva</label>
              <input
                type="password"
                className="line-input"
                placeholder="******"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
              />
            </div>

            {/* MENSAJE DE ERROR / INFO */}
            {mensaje && <p className="error-msg">{mensaje}</p>}

            <button type="submit" className="btn-save">
              Guardar Contraseña
            </button>
          </form>

          <div className="step-indicators">
            <span></span>
            <span className="active"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecuperarPaso2
