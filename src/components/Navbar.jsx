import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>DICRI - Sistema de Gestión de Evidencia</h1>
        </div>
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.nombre} {user?.apellido}</span>
            <span className="user-role">{user?.rol}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
