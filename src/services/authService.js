import api from './api'

const authService = {
  login: async (usuario_login, password_plano) => {
    try {
      const response = await api.post('/auth/login', {
        usuario_login,
        password_plano
      })
      
      const { token, user } = response.data
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' }
    }
  }
}

export default authService
