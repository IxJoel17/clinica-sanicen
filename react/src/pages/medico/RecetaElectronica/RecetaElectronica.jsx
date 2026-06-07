import { useState, useEffect } from 'react'
import LayoutWithSidebar from '../../../components/LayoutWithSidebar'
import { useAuth } from '../../../context/AuthContext'
import { recetasAPI, pacientesAPI } from '../../../services/api'
import '../../../styles/common.css'
import './RecetaElectronica.css'

function RecetaElectronica() {
  const { user } = useAuth()
  const [recetas, setRecetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.correo) {
      cargarRecetas()
    }
  }, [user])

  const cargarRecetas = async () => {
    setLoading(true)
    try {
      let idPaciente = null
      if (user?.correo) {
        try {
          const paciente = await pacientesAPI.getByCorreo(user.correo)
          idPaciente = paciente.idPaciente
        } catch (err) {
          console.log('Paciente no encontrado')
          setRecetas([])
          return
        }
      }

      if (!idPaciente) {
        setRecetas([])
        return
      }

      const recetasData = await recetasAPI.getByPaciente(idPaciente)
      const recetasArray = recetasData?.data || recetasData || []
      // Ordenar recetas de más recientes a más antiguas
      const recetasOrdenadas = recetasArray.sort((a, b) => {
        const fechaA = new Date(a.fecha || a.fechaCreacion || 0)
        const fechaB = new Date(b.fecha || b.fechaCreacion || 0)
        return fechaB - fechaA // Más recientes primero
      })
      setRecetas(recetasOrdenadas)
    } catch (err) {
      console.error('Error cargando recetas:', err)
      setError('Error al cargar las recetas')
      setRecetas([])
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

  const isActiva = (fecha) => {
    if (!fecha) return false
    const fechaReceta = new Date(fecha)
    const fechaLimite = new Date(fechaReceta)
    fechaLimite.setDate(fechaLimite.getDate() + 30)
    return new Date() <= fechaLimite
  }

  const formatCodigo = (id, fecha) => {
    if (!fecha) return `R-${id}`
    const date = new Date(fecha)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `R-${year}${month}${day}-${String(id).padStart(3, '0')}`
  }

  if (loading) {
    return (
      <LayoutWithSidebar>
        <div className="receta-container container">
          <div>Cargando recetas...</div>
        </div>
      </LayoutWithSidebar>
    )
  }

  return (
    <LayoutWithSidebar>
      <div className="receta-container container">
        <div className="header-receta">Recetas Médicas Electrónicas</div>

        {error && (
          <div style={{ color: '#E8505B', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
            {error}
          </div>
        )}

        {recetas.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No tienes recetas registradas
          </div>
        ) : (
          <>
            <table className="tabla-recetas">
              <thead>
                <tr>
                  <th>CÓDIGO RECETA</th>
                  <th>FECHA DE EMISIÓN</th>
                  <th>MÉDICO EMISOR</th>
                  <th>INDICACIONES</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {recetas.map((receta) => {
                  const activa = isActiva(receta.fecha)
                  return (
                    <tr key={receta.idReceta}>
                      <td>{formatCodigo(receta.idReceta, receta.fecha)}</td>
                      <td>{formatFecha(receta.fecha)}</td>
                      <td>
                        {receta.medico?.nombre} {receta.medico?.apellido}
                      </td>
                      <td>
                        {receta.indicaciones
                          ? receta.indicaciones.substring(0, 50) + '...'
                          : 'Sin indicaciones'}
                      </td>
                      <td className={activa ? 'estado-activo' : 'estado-vencido'}>
                        {activa ? 'Activa' : 'Vencida'}
                      </td>
                      <td>
                        <button className="btn-descargar">Descargar PDF</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="nota-informativa">
              <strong>Aviso Importante:</strong> Las recetas tienen una vigencia de 30 días a partir
              de la fecha de emisión. Las recetas vencidas solo sirven como registro histórico.
            </div>
          </>
        )}
      </div>
    </LayoutWithSidebar>
  )
}

export default RecetaElectronica
