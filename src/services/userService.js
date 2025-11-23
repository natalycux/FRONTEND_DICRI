import api from './api'

const userService = {
  // Listar todos los usuarios
  getAll: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener usuarios' }
    }
  },

  // Crear nuevo usuario
  create: async (userData) => {
    try {
      // Agregar activo = 1 por defecto al crear usuario
      const dataToSend = {
        ...userData,
        activo: 1
      }
      const response = await api.post('/users', dataToSend)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear usuario' }
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar usuario' }
    }
  },

  // Cambiar estado (activar/desactivar)
  toggleEstado: async (id) => {
    try {
      const response = await api.put(`/users/${id}/toggle-estado`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al cambiar estado' }
    }
  }
}

export default userService
