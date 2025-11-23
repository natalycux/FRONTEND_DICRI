import api from './api'

const expedienteService = {
  // Listar expedientes con filtros opcionales
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key])
        }
      })
      
      const response = await api.get(`/expedientes?${params.toString()}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener expedientes' }
    }
  },

  // Obtener un expediente por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/expedientes/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener expediente' }
    }
  },

  // Crear nuevo expediente
  create: async (expedienteData) => {
    try {
      const response = await api.post('/expedientes', expedienteData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear expediente' }
    }
  },

  // Actualizar expediente
  update: async (id, expedienteData) => {
    try {
      const response = await api.put(`/expedientes/${id}`, expedienteData)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar expediente' }
    }
  },

  // Conteo de expedientes por estado
  getConteo: async () => {
    try {
      const response = await api.get('/expedientes/conteo')
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener conteo' }
    }
  },

  // Enviar a revisión
  enviarRevision: async (id) => {
    try {
      const response = await api.put(`/expedientes/${id}/enviar-revision`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al enviar a revisión' }
    }
  },

  // Aprobar expediente
  aprobar: async (id) => {
    try {
      const response = await api.put(`/expedientes/${id}/aprobar`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al aprobar expediente' }
    }
  },

  // Rechazar expediente
  rechazar: async (id, motivo_rechazo) => {
    try {
      const response = await api.put(`/expedientes/${id}/rechazar`, {
        motivo_rechazo
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Error al rechazar expediente' }
    }
  }
}

export default expedienteService
