import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const { isAdmin } = useAuth()

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <span className="sidebar-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/expedientes" className="sidebar-link">
          <span className="sidebar-icon">📁</span>
          <span>Expedientes</span>
        </NavLink>

        {isAdmin() && (
          <NavLink to="/usuarios" className="sidebar-link">
            <span className="sidebar-icon">👥</span>
            <span>Usuarios</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}

export default Sidebar
