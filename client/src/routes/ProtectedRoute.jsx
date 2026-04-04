import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user.role}`} />
  }

  return children
}