import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import expedienteService from '../services/expedienteService'
import catalogoService from '../services/catalogoService'
import Card from '../components/Card'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'
import './ExpedienteForm.css'

const ExpedienteForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    numero_mp: '',
    numero_averiguacion: '',
    delito: '',
    lugar_hecho: '',
    fecha_hecho: '',
    id_departamento_hecho: '',
    id_municipio_hecho: '',
    sintesis_hecho: '',
    observaciones: ''
  })

  const [departamentos, setDepartamentos] = useState([])
  const [municipios, setMunicipios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDepartamentos()
    if (isEdit) {
      loadExpediente()
    }
  }, [id])

  useEffect(() => {
    if (formData.id_departamento_hecho) {
      loadMunicipios(formData.id_departamento_hecho)
    }
  }, [formData.id_departamento_hecho])

  const loadDepartamentos = async () => {
    try {
      const data = await catalogoService.getDepartamentos()
      setDepartamentos(data.map(d => ({ value: d.id, label: d.nombre })))
    } catch (error) {
      console.error('Error al cargar departamentos:', error)
    }
  }

  const loadMunicipios = async (departamentoId) => {
    try {
      const data = await catalogoService.getMunicipios(departamentoId)
      setMunicipios(data.map(m => ({ value: m.id, label: m.nombre })))
    } catch (error) {
      console.error('Error al cargar municipios:', error)
    }
  }

  const loadExpediente = async () => {
    try {
      const data = await expedienteService.getById(id)
      setFormData({
        numero_mp: data.numero_mp,
        numero_averiguacion: data.numero_averiguacion,
        delito: data.delito,
        lugar_hecho: data.lugar_hecho,
        fecha_hecho: data.fecha_hecho?.split('T')[0] || '',
        id_departamento_hecho: data.id_departamento_hecho,
        id_municipio_hecho: data.id_municipio_hecho,
        sintesis_hecho: data.sintesis_hecho,
        observaciones: data.observaciones || ''
      })
    } catch (error) {
      console.error('Error al cargar expediente:', error)
      setError('Error al cargar el expediente')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Si cambia el departamento, resetear municipio
    if (name === 'id_departamento_hecho') {
      setFormData(prev => ({
        ...prev,
        id_departamento_hecho: value,
        id_municipio_hecho: ''
      }))
      setMunicipios([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const dataToSend = {
        ...formData,
        id_departamento_hecho: parseInt(formData.id_departamento_hecho),
        id_municipio_hecho: parseInt(formData.id_municipio_hecho)
      }

      if (isEdit) {
        await expedienteService.update(id, dataToSend)
      } else {
        await expedienteService.create(dataToSend)
      }
      navigate('/expedientes')
    } catch (err) {
      setError(err.message || 'Error al guardar el expediente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="expediente-form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Editar Expediente' : 'Nuevo Expediente'}</h1>
        <Button variant="secondary" onClick={() => navigate('/expedientes')}>
          Cancelar
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Número MP"
              name="numero_mp"
              value={formData.numero_mp}
              onChange={handleChange}
              placeholder="MP-001-2025-00001"
              required
            />

            <Input
              label="Número de Averiguación"
              name="numero_averiguacion"
              value={formData.numero_averiguacion}
              onChange={handleChange}
              placeholder="AV-2025-0001"
              required
            />

            <Input
              label="Delito"
              name="delito"
              value={formData.delito}
              onChange={handleChange}
              placeholder="Tipo de delito"
              required
            />

            <Input
              label="Fecha del Hecho"
              type="date"
              name="fecha_hecho"
              value={formData.fecha_hecho}
              onChange={handleChange}
              required
            />

            <Select
              label="Departamento"
              name="id_departamento_hecho"
              value={formData.id_departamento_hecho}
              onChange={handleChange}
              options={departamentos}
              required
            />

            <Select
              label="Municipio"
              name="id_municipio_hecho"
              value={formData.id_municipio_hecho}
              onChange={handleChange}
              options={municipios}
              required
              disabled={!formData.id_departamento_hecho}
            />

            <div className="form-group full-width">
              <label htmlFor="lugar_hecho" className="form-label">
                Lugar del Hecho <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lugar_hecho"
                name="lugar_hecho"
                value={formData.lugar_hecho}
                onChange={handleChange}
                placeholder="Descripción del lugar"
                required
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="sintesis_hecho" className="form-label">
                Síntesis del Hecho <span className="required">*</span>
              </label>
              <textarea
                id="sintesis_hecho"
                name="sintesis_hecho"
                value={formData.sintesis_hecho}
                onChange={handleChange}
                placeholder="Descripción detallada del hecho"
                required
                className="form-textarea"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="observaciones" className="form-label">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Observaciones adicionales (opcional)"
                className="form-textarea"
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-3">
              {error}
            </div>
          )}

          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Expediente'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/expedientes')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ExpedienteForm
