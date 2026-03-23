import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

const PublicOnlyRoute = ({ children }) => {
  const { token } = useAuth()

  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicOnlyRoute
