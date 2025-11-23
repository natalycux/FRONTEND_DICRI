import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import expedienteService from '../services/expedienteService'
import indicioService from '../services/indicioService'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Table from '../components/Table'
import Input from '../components/Input'
import './ExpedienteDetalle.css'

const ExpedienteDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, isCoordinador, isTecnico } = useAuth()

  const [expediente, setExpediente] = useState(null)
  const [indicios, setIndicios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showIndicioModal, setShowIndicioModal] = useState(false)
  const [showRechazoModal, setShowRechazoModal] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')

  const [nuevoIndicio, setNuevoIndicio] = useState({
    descripcion: '',
    lugar_hallazgo: '',
    fecha_hallazgo: '',
    observaciones: ''
  })

  useEffect(() => {
    loadExpediente()
    loadIndicios()
  }, [id])

  const loadExpediente = async () => {
    try {
      const data = await expedienteService.getById(id)
      setExpediente(data)
    } catch (error) {
      console.error('Error al cargar expediente:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadIndicios = async () => {
    try {
      const data = await indicioService.getByExpediente(id)
      setIndicios(data)
    } catch (error) {
      console.error('Error al cargar indicios:', error)
    }
  }

  const handleEnviarRevision = async () => {
    if (!window.confirm('¿Está seguro de enviar este expediente a revisión?')) return

    try {
      await expedienteService.enviarRevision(id)
      loadExpediente()
      alert('Expediente enviado a revisión exitosamente')
    } catch (error) {
      alert('Error al enviar a revisión: ' + error.message)
    }
  }

  const handleAprobar = async () => {
    if (!window.confirm('¿Está seguro de aprobar este expediente?')) return

    try {
      await expedienteService.aprobar(id)
      loadExpediente()
      alert('Expediente aprobado exitosamente')
    } catch (error) {
      alert('Error al aprobar: ' + error.message)
    }
  }

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      alert('Debe proporcionar un motivo de rechazo')
      return
    }

    try {
      await expedienteService.rechazar(id, motivoRechazo)
      setShowRechazoModal(false)
      setMotivoRechazo('')
      loadExpediente()
      alert('Expediente rechazado')
    } catch (error) {
      alert('Error al rechazar: ' + error.message)
    }
  }

  const handleAgregarIndicio = async () => {
    try {
      await indicioService.create(id, nuevoIndicio)
      setShowIndicioModal(false)
      setNuevoIndicio({
        descripcion: '',
        lugar_hallazgo: '',
        fecha_hallazgo: '',
        observaciones: ''
      })
      loadIndicios()
      alert('Indicio agregado exitosamente')
    } catch (error) {
      alert('Error al agregar indicio: ' + error.message)
    }
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

  const indiciosColumns = [
    { header: 'Descripción', accessor: 'descripcion' },
    { header: 'Lugar de Hallazgo', accessor: 'lugar_hallazgo' },
    {
      header: 'Fecha de Hallazgo',
      accessor: 'fecha_hallazgo',
      render: (value) => new Date(value).toLocaleDateString('es-GT')
    },
    { header: 'Observaciones', accessor: 'observaciones' }
  ]

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!expediente) {
    return <div>Expediente no encontrado</div>
  }

  return (
    <div className="expediente-detalle-page">
      <div className="page-header">
        <div>
          <h1>Detalle del Expediente</h1>
          <p className="expediente-numero">{expediente.numero_mp}</p>
        </div>
        <div className="header-actions">
          {expediente.estado === 'BORRADOR' && isCoordinador() && (
            <Button onClick={handleEnviarRevision}>
              Enviar a Revisión
            </Button>
          )}
          {expediente.estado === 'EN_REVISION' && isAdmin() && (
            <>
              <Button variant="success" onClick={handleAprobar}>
                Aprobar
              </Button>
              <Button variant="danger" onClick={() => setShowRechazoModal(true)}>
                Rechazar
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => navigate('/expedientes')}>
            Volver
          </Button>
        </div>
      </div>

      <div className="detalle-grid">
        <Card title="Información General">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Estado:</span>
              <span>{getEstadoBadge(expediente.estado)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">No. MP:</span>
              <span>{expediente.numero_mp}</span>
            </div>
            <div className="info-item">
              <span className="info-label">No. Averiguación:</span>
              <span>{expediente.numero_averiguacion}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Delito:</span>
              <span>{expediente.delito}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fecha del Hecho:</span>
              <span>{new Date(expediente.fecha_hecho).toLocaleDateString('es-GT')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Lugar:</span>
              <span>{expediente.lugar_hecho}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Síntesis:</span>
              <p>{expediente.sintesis_hecho}</p>
            </div>
            {expediente.observaciones && (
              <div className="info-item full-width">
                <span className="info-label">Observaciones:</span>
                <p>{expediente.observaciones}</p>
              </div>
            )}
            {expediente.motivo_rechazo && (
              <div className="info-item full-width alert-error">
                <span className="info-label">Motivo de Rechazo:</span>
                <p>{expediente.motivo_rechazo}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Indicios">
          <div className="indicios-header">
            <h3>Lista de Indicios ({indicios.length})</h3>
            {isTecnico() && (
              <Button size="small" onClick={() => setShowIndicioModal(true)}>
                + Agregar Indicio
              </Button>
            )}
          </div>
          <Table columns={indiciosColumns} data={indicios} />
        </Card>
      </div>

      {/* Modal para agregar indicio */}
      <Modal
        isOpen={showIndicioModal}
        onClose={() => setShowIndicioModal(false)}
        title="Agregar Indicio"
      >
        <div className="form-grid">
          <Input
            label="Descripción"
            name="descripcion"
            value={nuevoIndicio.descripcion}
            onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, descripcion: e.target.value })}
            required
          />
          <Input
            label="Lugar de Hallazgo"
            name="lugar_hallazgo"
            value={nuevoIndicio.lugar_hallazgo}
            onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, lugar_hallazgo: e.target.value })}
            required
          />
          <Input
            label="Fecha de Hallazgo"
            type="date"
            name="fecha_hallazgo"
            value={nuevoIndicio.fecha_hallazgo}
            onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, fecha_hallazgo: e.target.value })}
            required
          />
          <div className="form-group full-width">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-textarea"
              value={nuevoIndicio.observaciones}
              onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, observaciones: e.target.value })}
            />
          </div>
        </div>
        <div className="modal-actions">
          <Button onClick={handleAgregarIndicio}>Guardar</Button>
          <Button variant="secondary" onClick={() => setShowIndicioModal(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>

      {/* Modal para rechazar */}
      <Modal
        isOpen={showRechazoModal}
        onClose={() => setShowRechazoModal(false)}
        title="Rechazar Expediente"
        size="small"
      >
        <div className="form-group">
          <label className="form-label">Motivo de Rechazo *</label>
          <textarea
            className="form-textarea"
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            placeholder="Indique el motivo del rechazo..."
            required
          />
        </div>
        <div className="modal-actions">
          <Button variant="danger" onClick={handleRechazar}>
            Rechazar Expediente
          </Button>
          <Button variant="secondary" onClick={() => setShowRechazoModal(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ExpedienteDetalle
