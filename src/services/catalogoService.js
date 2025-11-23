import api from './api'

const catalogoService = {
  // Obtener departamentos
  getDepartamentos: async () => {
    try {
      const response = await api.get('/catalogos/departamentos')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener departamentos' }
    }
  },

  // Obtener municipios por departamento
  getMunicipios: async (departamentoId) => {
    try {
      const response = await api.get(`/catalogos/municipios/${departamentoId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener municipios' }
    }
  },

  // Obtener estados de expediente
  getEstadosExpediente: async () => {
    try {
      const response = await api.get('/catalogos/estados-expediente')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener estados' }
    }
  },

  // Obtener roles
  getRoles: async () => {
    try {
      const response = await api.get('/catalogos/roles')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener roles' }
    }
  }
}

export default catalogoService
