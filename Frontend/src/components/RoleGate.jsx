import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

const RoleGate = ({ allow = [], children }) => {
  const { hasRole } = useAuth()

  if (!hasRole(allow)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleGate
