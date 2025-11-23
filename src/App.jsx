import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Expedientes from './pages/Expedientes'
import ExpedienteDetalle from './pages/ExpedienteDetalle'
import ExpedienteForm from './pages/ExpedienteForm'
import Usuarios from './pages/Usuarios'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expedientes" element={<Expedientes />} />
              <Route path="/expedientes/nuevo" element={<ExpedienteForm />} />
              <Route path="/expedientes/:id" element={<ExpedienteDetalle />} />
              <Route path="/expedientes/:id/editar" element={<ExpedienteForm />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
