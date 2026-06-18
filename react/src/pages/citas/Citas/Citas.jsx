import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import qrYape from '../../../assets/img/pagos/qr-yape.jpeg'
import qrPlin from '../../../assets/img/pagos/qr-plin.jpeg'
import { citasAPI, medicosAPI, especialidadesAPI, pacientesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './Citas.css'
function Citas() {
   const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    idPaciente: null,
    idMedico: '',
    fecha: '',
    hora: '',
    motivo: '',
  })
  const [citas, setCitas] = useState([])
  const [medicos, setMedicos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [medicosFiltrados, setMedicosFiltrados] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCitas, setLoadingCitas] = useState(true)
  const [showReagendarModal, setShowReagendarModal] = useState(false)
  const [citaAReagendar, setCitaAReagendar] = useState(null)
  const [reagendarData, setReagendarData] = useState({ fecha: '', hora: '' })
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false)
  const [citaSeleccionadaPago, setCitaSeleccionadaPago] = useState(null)
  const [pagoExitoso, setPagoExitoso] = useState(false)
  const [citaGuardada, setCitaGuardada] = useState(null)

const [datosPago, setDatosPago] = useState({
  monto: 20,
  formaPago: '',
  nombreTarjeta: '',
  numeroTarjeta: '',
  vencimiento: '',
  cvv: '',
  numeroOperacion: '',
})

  // Cargar especialidades y médicos al montar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [espData, medData] = await Promise.all([
          especialidadesAPI.getAll(),
          medicosAPI.getAll(),
        ])
        setEspecialidades(espData)
        setMedicos(medData)
        setMedicosFiltrados(medData)
      } catch (err) {
        console.error('Error cargando datos:', err)
        setError('Error al cargar especialidades y médicos')
      }
    }
    cargarDatos()
  }, [])

  // Cargar citas del paciente si está logueado
  useEffect(() => {
    if (user?.idUsuario) {
      cargarCitas()
    }
  }, [user])

  const cargarCitas = async () => {
    setLoadingCitas(true)
    try {
      // Buscar al paciente por correo para obtener el idPaciente correcto
      let idPacienteParaBuscar = formData.idPaciente
      
      if (!idPacienteParaBuscar && user?.correo) {
        try {
          const paciente = await pacientesAPI.getByCorreo(user.correo)
          idPacienteParaBuscar = paciente.idPaciente
          setFormData(prev => ({ ...prev, idPaciente: idPacienteParaBuscar }))
        } catch (err) {
          // Si no existe el paciente, no hay citas aún
          console.log('Paciente no encontrado, no hay citas para mostrar')
          setCitas([])
          return
        }
      }

      // Si no tenemos idPaciente, no podemos cargar citas
      if (!idPacienteParaBuscar) {
        setCitas([])
        return
      }

      // Cargar citas del paciente
      const response = await citasAPI.getByPaciente(idPacienteParaBuscar)
      const citasData = response.citas || []
      // Ordenar citas de más recientes a más alejadas (por fecha y hora)
      const citasOrdenadas = citasData.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`)
        const fechaB = new Date(`${b.fecha}T${b.hora}`)
        return fechaB - fechaA // Más recientes primero
      })
      setCitas(citasOrdenadas)
      
      // Asegurar que el idPaciente esté en el formData
      if (!formData.idPaciente && idPacienteParaBuscar) {
        setFormData(prev => ({ ...prev, idPaciente: idPacienteParaBuscar }))
      }
    } catch (err) {
      console.error('Error cargando citas:', err)
      // No mostrar error si simplemente no hay paciente aún
      if (err.response?.status !== 404) {
        setError('Error al cargar las citas')
      }
      setCitas([])
    } finally {
      setLoadingCitas(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setError('')

    // Si cambia la especialidad, filtrar médicos
    if (name === 'especialidad') {
      if (value) {
        const medicosEsp = medicos.filter(m => m.especialidad?.idEspecialidad === parseInt(value))
        setMedicosFiltrados(medicosEsp)
      } else {
        setMedicosFiltrados(medicos)
      }
      setFormData(prev => ({ ...prev, idMedico: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Asegurarse de que el paciente existe antes de crear la cita
      let idPacienteParaCita = formData.idPaciente

      // Si no tenemos idPaciente, buscar por correo o crear el paciente
      if (!idPacienteParaCita && user?.correo) {
        try {
          // Intentar buscar paciente por correo
          const paciente = await pacientesAPI.getByCorreo(user.correo)
          idPacienteParaCita = paciente.idPaciente
        } catch (err) {
          // Si no existe el paciente, crearlo automáticamente con los datos del usuario
          console.log('Paciente no encontrado, creando automáticamente...')
          const nuevoPaciente = await pacientesAPI.create({
            nombre: user.nombre || '',
            apellido: user.apellido || '',
            correo: user.correo || '',
            telefono: user.telefono || '',
            direccion: user.direccion || '',
            // El número de historia se generará automáticamente en el backend
          })
          idPacienteParaCita = nuevoPaciente.idPaciente
          // Actualizar el formData con el nuevo idPaciente
          setFormData(prev => ({ ...prev, idPaciente: idPacienteParaCita }))
        }
      }

      // Si aún no tenemos idPaciente, mostrar error
      if (!idPacienteParaCita) {
        throw new Error('No se pudo obtener o crear el perfil del paciente. Por favor, completa tu perfil primero.')
      }

      // Crear la cita con el idPaciente correcto
      const response = await citasAPI.create({
        idPaciente: idPacienteParaCita,
        idMedico: parseInt(formData.idMedico),
        fecha: formData.fecha,
        hora: formData.hora + ':00', // Asegurar formato HH:mm:ss
        motivo: formData.motivo,
      })
      const nuevaCita = response?.data || response

        setCitaGuardada(nuevaCita)

        setDatosPago({
          monto: 20,
          formaPago: '',
          nombreTarjeta: '',
          numeroTarjeta: '',
          vencimiento: '',
          cvv: '',
          numeroOperacion: '',
        })

        setModalPagoAbierto(true)

      // Limpiar formulario
      setFormData({
        ...formData,
        idPaciente: idPacienteParaCita, // Mantener el idPaciente
        idMedico: '',
        fecha: '',
        hora: '',
        motivo: '',
      })

      // Recargar citas
      await cargarCitas()
      //navigate('/confirmar-cita')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al crear la cita. Intenta nuevamente.')
      console.error('Error al crear cita:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    return hora.substring(0, 5) // HH:mm
  }

  const handleCancelarCita = async (idCita) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta cita?')) {
      return
    }

    try {
      await citasAPI.update(idCita, { estado: 'cancelada' })
      setError('')
      await cargarCitas()
      alert('✅ Cita cancelada exitosamente')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cancelar la cita')
    }
  }

  const handleAbrirReagendar = (cita) => {
    setCitaAReagendar(cita)
    setReagendarData({
      fecha: cita.fecha || '',
      hora: cita.hora?.substring(0, 5) || '',
    })
    setShowReagendarModal(true)
    setError('')
  }

  const handleCerrarReagendar = () => {
    setShowReagendarModal(false)
    setCitaAReagendar(null)
    setReagendarData({ fecha: '', hora: '' })
  }

  const handleReagendarCita = async (e) => {
    e.preventDefault()
    if (!citaAReagendar) return

    try {
      await citasAPI.update(citaAReagendar.idCita, {
        fecha: reagendarData.fecha,
        hora: reagendarData.hora + ':00',
        estado: 'programada', // Mantener como programada
      })
      setError('')
      await cargarCitas()
      handleCerrarReagendar()
      alert('✅ Cita reagendada exitosamente')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al reagendar la cita')
    }
  }

    const cerrarModalPago = () => {
      setModalPagoAbierto(false)
      setPagoExitoso(false)
      setCitaGuardada(null)
      setDatosPago({
        monto: 20,
        formaPago: '',
        nombreTarjeta: '',
        numeroTarjeta: '',
        vencimiento: '',
        cvv: '',
        numeroOperacion: '',
      })
    }

    const handleChangePago = (e) => {
      const { name, value } = e.target

      setDatosPago({
        ...datosPago,
        [name]: value,
      })
    }

    const confirmarPago = (e) => {
  e.preventDefault()

  if (!datosPago.formaPago) {
    alert('Seleccione la forma de pago.')
    return
  }
    if (datosPago.formaPago === 'TARJETA') {
  if (
    !datosPago.nombreTarjeta ||
    !datosPago.numeroTarjeta ||
    !datosPago.vencimiento ||
    !datosPago.cvv
  ) {
    alert('Complete todos los datos de la tarjeta.')
    return
  }
}

if (datosPago.formaPago === 'TRANSFERENCIA') {
  if (!datosPago.numeroOperacion) {
    alert('Ingrese el número de operación de la transferencia.')
    return
  }
}

    const boleta = {
      numeroBoleta: `B-${Date.now()}`,
      cita: citaGuardada,
      monto: datosPago.monto,
      formaPago: datosPago.formaPago,
      fechaEmision: new Date().toLocaleDateString('es-PE'),
      estado: 'PAGADO',
    }

    console.log('Boleta generada:', boleta)

    setPagoExitoso(true)

    setTimeout(() => {
      setModalPagoAbierto(false)
      setPagoExitoso(false)
      setCitaGuardada(null)
      //navigate('/confirmar-cita')
    }, 2000)
  }

  const puedeCancelarOReagendar = (cita) => {
    return cita.estado === 'programada' || cita.estado === 'pendiente'
  }

  const horariosDisponibles = [
    { value: '08:00', label: '08:00 AM' },
    { value: '08:30', label: '08:30 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '09:30', label: '09:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '13:30', label: '01:30 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '14:30', label: '02:30 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '15:30', label: '03:30 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '16:30', label: '04:30 PM' },
    { value: '17:00', label: '05:00 PM' },
    { value: '17:30', label: '05:30 PM' },
    { value: '18:00', label: '06:00 PM' },
  ]

  const horariosOcupados = Array.isArray(citas)
    ? citas
        .filter((cita) =>
          cita.fecha === formData.fecha &&
          String(cita.medico?.idMedico || cita.idMedico || cita.medicoId) === String(formData.idMedico) &&
          cita.estado !== 'cancelada'
        )
        .map((cita) => cita.hora?.substring(0, 5))
    : []

  return (
    <LayoutWithSidebar>
      <div className="citas-container-main screen-center">
        <div className="citas-container container">
          <div className="header-citas">Registro de citas medicas</div>

          {error && (
            <div style={{ color: '#E8505B', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
              {error}
            </div>
          )}

          <div className="user-avatar">👤</div>

          <div className="citas-grid">
            <div className="reserva-form">
              <h3>DATOS DE LA RESERVA DE CITA</h3>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="especialidad">Especialidad</label>
                  <select
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    {especialidades.map((esp) => (
                      <option key={esp.idEspecialidad} value={esp.idEspecialidad}>
                        {esp.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="doctor">Médico de atención</label>
                  <select
                    id="doctor"
                    name="idMedico"
                    value={formData.idMedico}
                    onChange={handleChange}
                    required
                    disabled={!formData.especialidad}
                  >
                    <option value="">Seleccione un médico</option>
                    {medicosFiltrados.map((med) => (
                      <option key={med.idMedico} value={med.idMedico}>
                        {med.nombre} {med.apellido} {med.especialidad ? `(${med.especialidad.nombre})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="date">Fecha de cita</label>
                  <input
                    type="date"
                    id="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="hora">Hora de cita</label>

                  <select
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                    disabled={!formData.fecha || !formData.idMedico}
                  >
                    <option value="">
                      {!formData.fecha || !formData.idMedico
                        ? 'Seleccione primero fecha y médico'
                        : 'Seleccione una hora'}
                    </option>

                    {horariosDisponibles
                      .filter((horario) => !horariosOcupados.includes(horario.value))
                      .map((horario) => (
                        <option key={horario.value} value={horario.value}>
                          {horario.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="motivo">Motivo de consulta</label>
                  <textarea
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe el motivo de tu consulta"
                  />
                </div>

                <div className="reserva-buttons" style={{ marginTop: '30px' }}>
                <button
                  type="submit"
                  className="btn-realizar"
                  disabled={loading}
                >
                  {loading ? 'PROCESANDO...' : 'Registrar cita'}
                </button>

                  <button
                    type="reset"
                    className="btn-borrar"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        idMedico: '',
                        fecha: '',
                        hora: '',
                        motivo: '',
                        especialidad: '',
                      })
                      setMedicosFiltrados(medicos)
                    }}
                  >
                    Reiniciar registro
                  </button>
                </div>
              </form>
            </div>

            <div className="registros-list">
              <h3>REGISTROS DE LAS RESERVAS PROGRAMADAS</h3>

              {loadingCitas ? (
                <div className="loading-message">
                  <div className="loading-spinner"></div>
                  <span>Cargando citas...</span>
                </div>
              ) : citas.length === 0 ? (
                <div className="no-citas-message">
                  <div className="no-citas-icon">📅</div>
                  <p>No tiene citas agendadas</p>
                  <span className="no-citas-subtitle">Cuando agende una cita, aparecerá aquí</span>
                </div>
              ) : (
                <div className="citas-cards-container">
                  {citas.map((cita) => (
                    <div key={cita.idCita} className="cita-card">
                      <div className="cita-card-header">
                        <h4 className="cita-motivo">{cita.motivo || 'Consulta médica'}</h4>
                        <span
                          className={`cita-estado estado-${cita.estado?.toLowerCase() || 'programada'}`}
                        >
                          {cita.estado || 'programada'}
                        </span>
                      </div>
                      
                      <div className="cita-card-body">
                        <div className="cita-info-item">
                          <span className="cita-icon">📅</span>
                          <div className="cita-info-content">
                            <span className="cita-label">Fecha y Hora</span>
                            <span className="cita-value">
                              {formatFecha(cita.fecha)} - {formatHora(cita.hora)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="cita-info-item">
                          <span className="cita-icon">👨‍⚕️</span>
                          <div className="cita-info-content">
                            <span className="cita-label">Médico</span>
                            <span className="cita-value">
                              Dr(a). {cita.medico?.nombre} {cita.medico?.apellido}
                              {cita.medico?.especialidad && (
                                <span className="cita-especialidad"> - {cita.medico.especialidad}</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="cita-card-actions">
                        <Link
                          to={`/detalle-registro?citaId=${cita.idCita}`}
                          className="btn-cita-info"
                        >
                          <span>📋</span>
                          Ver información
                        </Link>
                        {puedeCancelarOReagendar(cita) && (
                          <>
                            <button
                              onClick={() => handleCancelarCita(cita.idCita)}
                              className="btn-cita-cancelar"
                            >
                              <span>❌</span>
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleAbrirReagendar(cita)}
                              className="btn-cita-reagendar"
                            >
                              <span>📅</span>
                              Reagendar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="terminos">Acepto los términos de privacidad</div>
            </div>
          </div>
        </div>
      </div>
        {/* Modal para Pago */}
      {modalPagoAbierto && (
        <div className="modal-pago-overlay">
          <div className="modal-pago-box">
            {!pagoExitoso ? (
              <>
                <div className="modal-pago-header">
                  <h2>Pago de cita médica</h2>
                  <button className="modal-pago-close" onClick={cerrarModalPago}>
                    ×
                  </button>
                </div>

                <div className="modal-pago-body">
                  <form onSubmit={confirmarPago}>
                    <div className="input-group">
                      <label>Monto a pagar</label>
                      <input
                        type="number"
                        name="monto"
                        value={datosPago.monto}
                        readOnly
                      />
                    </div>

                    <div className="input-group">
                      <label>Forma de pago</label>
                      <select
                        name="formaPago"
                        value={datosPago.formaPago}
                        onChange={handleChangePago}
                        required
                      >
                        <option value="">Seleccione forma de pago</option>
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="YAPE">Yape</option>
                        <option value="PLIN">Plin</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                      </select>
                    </div>
                    
                    {datosPago.formaPago === 'EFECTIVO' && (
                      <div className="pago-extra-container">
                        <p>
                          El pago se realizará en caja al momento de la atención.
                          Monto a pagar: <strong>S/ {datosPago.monto}</strong>
                        </p>
                      </div>
                    )}

                    {datosPago.formaPago === 'YAPE' && (
                      <div className="pago-extra-container">
                        <p><strong>Nombre:</strong> Clínica Sanicen</p>
                        <p><strong>Número:</strong> 999 888 777</p>
                        <p>Escanea el QR o realiza el pago al número indicado.</p>
                      </div>
                    )}

                    {datosPago.formaPago === 'PLIN' && (
                      <div className="pago-extra-container">
                        <p><strong>Nombre:</strong> Clínica Sanicen</p>
                        <p><strong>Número:</strong> 999 888 777</p>
                        <p>Escanea el QR o realiza el pago al número indicado.</p>
                      </div>
                    )}

                    {datosPago.formaPago === 'YAPE' && (
                      <div className="qr-pago-container">
                        <h3>Pago por Yape</h3>

                        <p className="qr-nombre">
                          Clínica Sanicen
                        </p>

                        <img
                          src={qrYape}
                          alt="QR de Yape"
                          className="qr-pago-img"
                        />

                        <p className="qr-numero">
                          Número: 940 737 518
                        </p>

                        <p>Escanea el QR o realiza el pago al número indicado.</p>
                      </div>
                    )}

                    {datosPago.formaPago === 'PLIN' && (
                      <div className="qr-pago-container">
                        <h3>Pago por Plin</h3>

                        <p className="qr-nombre">
                          Clínica Sanicen
                        </p>

                        <img
                          src={qrPlin}
                          alt="QR de Plin"
                          className="qr-pago-img"
                        />

                        <p className="qr-numero">
                          Número: 940 737 518
                        </p>

                        <p>Escanea el QR o realiza el pago al número indicado.</p>
                      </div>
)}

                    {datosPago.formaPago === 'TARJETA' && (
                      <div className="pago-extra-container">
                        <h3>Datos de la tarjeta</h3>

                        <div className="form-group">
                          <label>Nombre del titular</label>
                          <input
                            type="text"
                            name="nombreTarjeta"
                            value={datosPago.nombreTarjeta}
                            onChange={handleChangePago}
                            placeholder="Ej: Daniel Meza"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Número de tarjeta</label>
                          <input
                            type="text"
                            name="numeroTarjeta"
                            value={datosPago.numeroTarjeta}
                            onChange={handleChangePago}
                            placeholder="Ej: 4111 1111 1111 1111"
                            maxLength="19"
                            required
                          />
                        </div>

                        <div className="tarjeta-row">
                          <div className="form-group">
                            <label>Vencimiento</label>
                            <input
                              type="text"
                              name="vencimiento"
                              value={datosPago.vencimiento}
                              onChange={handleChangePago}
                              placeholder="MM/AA"
                              maxLength="5"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label>CVV</label>
                            <input
                              type="password"
                              name="cvv"
                              value={datosPago.cvv}
                              onChange={handleChangePago}
                              placeholder="***"
                              maxLength="4"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {datosPago.formaPago === 'TRANSFERENCIA' && (
                      <div className="pago-extra-container">
                        <h3>Datos para transferencia</h3>

                        <div className="datos-transferencia">
                          <p><strong>Banco:</strong> BCP</p>
                          <p><strong>Titular:</strong> Clínica Sanicen</p>
                          <p><strong>Cuenta:</strong> 191-12345678-0-11</p>
                          <p><strong>CCI:</strong> 002-191-001234567801-11</p>
                          <p><strong>Monto:</strong> S/ {datosPago.monto}</p>
                        </div>

                        <div className="form-group">
                          <label>Número de operación</label>
                          <input
                            type="text"
                            name="numeroOperacion"
                            value={datosPago.numeroOperacion}
                            onChange={handleChangePago}
                            placeholder="Ej: 000458921"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="modal-pago-actions">
                      <button type="button" className="btn-modal-cancelar" onClick={cerrarModalPago}>
                        Cancelar
                      </button>

                      <button type="submit" className="btn-modal-pagar">
                        Generar boleta
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="pago-exitoso">
                <div className="check-icon">✅</div>
                <h2>Cita registrada exitosamente</h2>
                <p>El pago fue realizado correctamente.</p>
                <p>Redirigiendo a tus citas...</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal para Reagendar */}
      {showReagendarModal && citaAReagendar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCerrarReagendar}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Reagendar Cita</h2>
            <p style={{ color: '#666' }}>
              <strong>Médico:</strong> {citaAReagendar.medico?.nombre}{' '}
              {citaAReagendar.medico?.apellido}
            </p>
            <p style={{ color: '#666' }}>
              <strong>Motivo:</strong> {citaAReagendar.motivo || 'Consulta médica'}
            </p>

            <form onSubmit={handleReagendarCita}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
                  htmlFor="fecha-reagendar"
                >
                  Nueva Fecha
                </label>
                <input
                  id="fecha-reagendar"
                  type="date"
                  required
                  value={reagendarData.fecha}
                  onChange={(e) =>
                    setReagendarData({ ...reagendarData, fecha: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}
                  htmlFor="hora-reagendar"
                >
                  Nueva Hora
                </label>
                <input
                  id="hora-reagendar"
                  type="time"
                  required
                  value={reagendarData.hora}
                  onChange={(e) =>
                    setReagendarData({ ...reagendarData, hora: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCerrarReagendar}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#f8f9fa',
                    color: '#6c757d',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 25px',
                    background: 'linear-gradient(135deg, #2d9cdb 0%, #1e7ba8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Reagendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutWithSidebar>
  )
}

export default Citas
