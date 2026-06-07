import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasRole } from '../utils/roles'

/**
 * Componente que protege rutas por rol específico
 * @param {ReactNode} children - Componentes hijos a renderizar
 * @param {string|string[]} allowedRoles - Rol(es) permitido(s)
 */
function ProtectedRouteByRole({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  // Verificar si el usuario tiene uno de los roles permitidos
  const hasPermission = roles.some(role => hasRole(user, role))

  if (!hasPermission) {
    // Redirigir al portal según su rol
    if (hasRole(user, 'medico')) {
      return <Navigate to="/portal-medico" replace />
    } else if (hasRole(user, 'administrador')) {
      return <Navigate to="/portal-admin" replace />
    }
    return <Navigate to="/portal" replace />
  }

  return children
}

export default ProtectedRouteByRole

