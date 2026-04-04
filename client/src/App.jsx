import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Login from './pages/auth/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import TeamManagement from './pages/admin/TeamManagement'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <h1>Admin</h1>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />

<Route path="/admin/users" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <UserManagement />
  </ProtectedRoute>
} />

<Route path="/admin/teams" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <TeamManagement />
  </ProtectedRoute>
} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}
