import { useState, useEffect } from 'react'
import userService from '../services/userService'
import catalogoService from '../services/catalogoService'
import Card from '../components/Card'
import Table from '../components/Table'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Select from '../components/Select'
import './Usuarios.css'

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario_login: '',
    password_plano: '',
    id_rol: ''
  })

  useEffect(() => {
    loadUsuarios()
    loadRoles()
  }, [])

  const loadUsuarios = async () => {
    try {
      const data = await userService.getAll()
      setUsuarios(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      const data = await catalogoService.getRoles()
      const rolesFormateados = data.map(r => ({ 
        value: r.id_rol || r.id, 
        label: r.nombre_rol || r.nombre 
      }))
      setRoles(rolesFormateados)
    } catch (error) {
      console.error('Error al cargar roles:', error)
    }
  }

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        usuario_login: user.usuario_login,
        password_plano: '',
        id_rol: user.id_rol
      })
    } else {
      setEditingUser(null)
      setFormData({
        nombre: '',
        apellido: '',
        usuario_login: '',
        password_plano: '',
        id_rol: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        id_rol: parseInt(formData.id_rol)
      }

      // Si es creación, agregar usuario_login y password
      if (!editingUser) {
        dataToSend.usuario_login = formData.usuario_login
        dataToSend.password_plano = formData.password_plano
      }

      // Si es edición y se cambió la contraseña, agregarla
      if (editingUser && formData.password_plano) {
        dataToSend.password_plano = formData.password_plano
      }

      if (editingUser) {
        const userId = editingUser.id_usuario || editingUser.id
        await userService.update(userId, dataToSend)
        handleCloseModal()
        await loadUsuarios()
        alert('Usuario actualizado exitosamente')
      } else {
        await userService.create(dataToSend)
        handleCloseModal()
        await loadUsuarios()
        alert('Usuario creado exitosamente')
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      alert('Error: ' + (error.message || 'Error al guardar usuario'))
    }
  }

  const handleToggleEstado = async (user) => {
    console.log('Usuario a cambiar estado:', user)
    const mensaje = user.estado ? 'desactivar' : 'activar'
    
    if (!window.confirm(`¿Está seguro de ${mensaje} al usuario ${user.usuario_login}?`)) {
      return
    }

    try {
      const response = await userService.toggleEstado(user.id_usuario || user.id)
      console.log('Respuesta toggle estado:', response)
      await loadUsuarios()
      alert(`Usuario ${user.estado ? 'desactivado' : 'activado'} exitosamente`)
    } catch (error) {
      console.error('Error completo:', error)
      alert('Error al cambiar estado: ' + (error.message || 'Error desconocido'))
    }
  }

  const columns = [
    {
      header: 'Usuario',
      accessor: 'usuario_login'
    },
    {
      header: 'Nombre',
      accessor: 'nombre',
      render: (value, row) => `${row.nombre} ${row.apellido}`
    },
    {
      header: 'Rol',
      accessor: 'nombre_rol'
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value) => (
        <span className={`badge ${value ? 'badge-aprobado' : 'badge-rechazado'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: 'id_usuario',
      render: (value, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="small" variant="outline" onClick={() => handleOpenModal(row)}>
            Editar
          </Button>
          <Button 
            size="small" 
            variant={row.estado ? 'danger' : 'success'}
            onClick={() => handleToggleEstado(row)}
          >
            {row.estado ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <Button onClick={() => handleOpenModal()}>
          + Nuevo Usuario
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : (
          <Table columns={columns} data={usuarios} />
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <Input
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <Input
              label="Usuario"
              name="usuario_login"
              value={formData.usuario_login}
              onChange={handleChange}
              required
              disabled={!!editingUser}
            />
            <Input
              label={editingUser ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              type="password"
              name="password_plano"
              value={formData.password_plano}
              onChange={handleChange}
              required={!editingUser}
            />
            <div className="full-width">
              <Select
                label="Rol"
                name="id_rol"
                value={formData.id_rol}
                onChange={handleChange}
                options={roles}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <Button type="submit">
              {editingUser ? 'Actualizar' : 'Crear Usuario'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Usuarios
