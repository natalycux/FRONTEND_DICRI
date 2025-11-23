import api from './api'

const indicioService = {
  // Obtener indicios de un expediente
  getByExpediente: async (expedienteId) => {
    try {
      const response = await api.get(`/expedientes/${expedienteId}/indicios`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener indicios' }
    }
  },

  // Agregar indicio a un expediente
  create: async (expedienteId, indicioData) => {
    try {
      const response = await api.post(`/expedientes/${expedienteId}/indicios`, indicioData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear indicio' }
    }
  }
}

export default indicioService
