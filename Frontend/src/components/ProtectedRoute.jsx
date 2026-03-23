import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import Loader from './Loader.jsx'

const ProtectedRoute = ({ children }) => {
  const { token, loading, tenantId } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader text="Restoring your workspace..." />
  }

  if (!token || !tenantId) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
