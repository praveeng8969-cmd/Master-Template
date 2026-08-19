import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../store/admin'

/**
 * Guards admin routes — redirects unauthenticated visitors to /admin/login.
 */
export default function AdminProtectedRoute({ children }) {
  const authenticated = useAdminAuth()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }
  return children
}