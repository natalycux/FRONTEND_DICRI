import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (usuario_login, password_plano) => {
    try {
      const data = await authService.login(usuario_login, password_plano)
      setUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const isAdmin = () => {
    return user && user.rol === 'ADMIN'
  }

  const isCoordinador = () => {
    return user && (user.rol === 'COORDINADOR' || user.rol === 'ADMIN')
  }

  const isTecnico = () => {
    return user && (user.rol === 'TECNICO' || user.rol === 'COORDINADOR' || user.rol === 'ADMIN')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isCoordinador,
    isTecnico,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
