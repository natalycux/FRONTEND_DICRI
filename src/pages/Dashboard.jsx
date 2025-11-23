import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import expedienteService from '../services/expedienteService'
import Card from '../components/Card'
import Button from '../components/Button'
import './Dashboard.css'

const Dashboard = () => {
  const [conteo, setConteo] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadConteo()
  }, [])

  const loadConteo = async () => {
    try {
      const data = await expedienteService.getConteo()
      setConteo(data)
    } catch (error) {
      console.error('Error al cargar conteo:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotal = () => {
    if (!conteo) return 0
    return Object.values(conteo).reduce((sum, val) => sum + val, 0)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bienvenido, {user?.nombre} {user?.apellido}</p>
        </div>
        <Button onClick={() => navigate('/expedientes/nuevo')}>
          + Nuevo Expediente
        </Button>
      </div>

      {loading ? (
        <div className="loading">Cargando estadísticas...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-total">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Total Expedientes</h3>
                <p className="stat-number">{getTotal()}</p>
              </div>
            </div>

            <div className="stat-card stat-borrador">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>En Borrador</h3>
                <p className="stat-number">{conteo?.BORRADOR || 0}</p>
              </div>
            </div>

            <div className="stat-card stat-revision">
              <div className="stat-icon">🔍</div>
              <div className="stat-info">
                <h3>En Revisión</h3>
                <p className="stat-number">{conteo?.EN_REVISION || 0}</p>
              </div>
            </div>

            <div className="stat-card stat-aprobado">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Aprobados</h3>
                <p className="stat-number">{conteo?.APROBADO || 0}</p>
              </div>
            </div>

            <div className="stat-card stat-rechazado">
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <h3>Rechazados</h3>
                <p className="stat-number">{conteo?.RECHAZADO || 0}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-actions">
            <Card title="Acciones Rápidas">
              <div className="quick-actions">
                <Button onClick={() => navigate('/expedientes/nuevo')}>
                  Crear Nuevo Expediente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/expedientes')}
                >
                  Ver Todos los Expedientes
                </Button>
                {user?.rol === 'ADMIN' && (
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/usuarios')}
                  >
                    Gestionar Usuarios
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
