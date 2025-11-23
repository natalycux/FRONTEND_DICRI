import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    usuario_login: '',
    password_plano: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.usuario_login, formData.password_plano)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>DICRI</h1>
          <h2>Sistema de Gestión de Evidencia</h2>
          <p>Ministerio Público de Guatemala</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Usuario"
            type="text"
            name="usuario_login"
            value={formData.usuario_login}
            onChange={handleChange}
            placeholder="Ingrese su usuario"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password_plano"
            value={formData.password_plano}
            onChange={handleChange}
            placeholder="Ingrese su contraseña"
            required
          />

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <p>© 2025 Ministerio Público de Guatemala - DICRI</p>
        </div>
      </div>
    </div>
  )
}

export default Login
