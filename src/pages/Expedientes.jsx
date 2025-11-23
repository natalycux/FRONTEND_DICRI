import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import expedienteService from '../services/expedienteService'
import catalogoService from '../services/catalogoService'
import Card from '../components/Card'
import Table from '../components/Table'
import Button from '../components/Button'
import Select from '../components/Select'
import Input from '../components/Input'
import './Expedientes.css'

const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([])
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    estado: '',
    numero_mp: ''
  })

  const navigate = useNavigate()
  const { isCoordinador } = useAuth()

  useEffect(() => {
    loadEstados()
    loadExpedientes()
  }, [])

  const loadEstados = async () => {
    try {
      const data = await catalogoService.getEstadosExpediente()
      setEstados(data.map(e => ({ value: e.nombre, label: e.nombre })))
    } catch (error) {
      console.error('Error al cargar estados:', error)
    }
  }

  const loadExpedientes = async () => {
    try {
      setLoading(true)
      const data = await expedienteService.getAll(filters)
      setExpedientes(data)
    } catch (error) {
      console.error('Error al cargar expedientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleSearch = () => {
    loadExpedientes()
  }

  const handleClearFilters = () => {
    setFilters({
      estado: '',
      numero_mp: ''
    })
    setTimeout(() => loadExpedientes(), 100)
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      'BORRADOR': 'badge-borrador',
      'EN_REVISION': 'badge-revision',
      'APROBADO': 'badge-aprobado',
      'RECHAZADO': 'badge-rechazado'
    }
    return <span className={`badge ${badges[estado] || ''}`}>{estado.replace('_', ' ')}</span>
  }

  const columns = [
    {
      header: 'No. MP',
      accessor: 'numero_mp'
    },
    {
      header: 'No. Averiguación',
      accessor: 'numero_averiguacion'
    },
    {
      header: 'Delito',
      accessor: 'delito'
    },
    {
      header: 'Fecha Hecho',
      accessor: 'fecha_hecho',
      render: (value) => new Date(value).toLocaleDateString('es-GT')
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value) => getEstadoBadge(value)
    },
    {
      header: 'Acciones',
      accessor: 'id',
      render: (value, row) => (
        <Button 
          size="small" 
          variant="outline"
          onClick={() => navigate(`/expedientes/${value}`)}
        >
          Ver Detalle
        </Button>
      )
    }
  ]

  return (
    <div className="expedientes-page">
      <div className="page-header">
        <h1>Expedientes</h1>
        {isCoordinador() && (
          <Button onClick={() => navigate('/expedientes/nuevo')}>
            + Nuevo Expediente
          </Button>
        )}
      </div>

      <Card>
        <div className="filters">
          <Input
            label="Número MP"
            name="numero_mp"
            value={filters.numero_mp}
            onChange={handleFilterChange}
            placeholder="Buscar por número MP"
          />
          <Select
            label="Estado"
            name="estado"
            value={filters.estado}
            onChange={handleFilterChange}
            options={estados}
            placeholder="Todos los estados"
          />
          <div className="filter-actions">
            <Button onClick={handleSearch}>Buscar</Button>
            <Button variant="secondary" onClick={handleClearFilters}>
              Limpiar
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-3">
        {loading ? (
          <div className="loading">Cargando expedientes...</div>
        ) : (
          <Table 
            columns={columns} 
            data={expedientes}
          />
        )}
      </Card>
    </div>
  )
}

export default Expedientes
