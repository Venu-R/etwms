import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TeamManagement from './pages/admin/TeamManagement';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ProjectDetail from './pages/manager/ProjectDetail';
import CreateTask from './pages/manager/CreateTask';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import TaskDetail from './pages/employee/TaskDetail';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/teams" element={<ProtectedRoute allowedRoles={['admin']}><TeamManagement /></ProtectedRoute>} />

              <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
              <Route path="/manager/teams" element={<ProtectedRoute allowedRoles={['manager']}><TeamManagement /></ProtectedRoute>} />
              <Route path="/manager/projects/:id" element={<ProtectedRoute allowedRoles={['manager']}><ProjectDetail /></ProtectedRoute>} />
              <Route path="/manager/projects/:id/create-task" element={<ProtectedRoute allowedRoles={['manager']}><CreateTask /></ProtectedRoute>} />

              <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
              <Route path="/employee/tasks/:id" element={<ProtectedRoute allowedRoles={['employee']}><TaskDetail /></ProtectedRoute>} />

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
