import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

const PublicOnlyRoute = ({ children }) => {
  const { token, tenantId } = useAuth()

  if (token && tenantId) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicOnlyRoute
