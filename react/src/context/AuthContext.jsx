import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('authToken')
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error cargando usuario:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
    setLoading(false)
  }, [])

  const login = async (usuario, contrasena) => {
    try {
      const response = await authAPI.login(usuario, contrasena)
      
      if (response.success) {
        const userData = {
          idUsuario: response.idUsuario,
          nombre: response.nombre,
          apellido: response.apellido,
          correo: response.correo,
          rol: response.rol,
          nombreUsuario: response.nombreUsuario,
        }
        
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        if (response.token) {
          localStorage.setItem('authToken', response.token)
        }
        
        return userData
      } else {
        throw new Error('Login fallido')
      }
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
  }

  const isAuthenticated = () => {
    return user !== null
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  
  return context
}

export default AuthContext

