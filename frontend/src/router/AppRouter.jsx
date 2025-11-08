import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Auth/Login'
import Signup from '../pages/Auth/Signup'
import AdminLayout from '../layouts/AdminLayout'
import PMLayout from '../layouts/PMLayout'
import TeamLayout from '../layouts/TeamLayout'
import FinanceLayout from '../layouts/FinanceLayout'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />

  return children
}

const AppRouter = () => {
  const { user } = useAuth()

  const getDashboardRoute = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'admin': return '/admin'
      case 'project_manager': return '/pm'
      case 'team_member': return '/team'
      case 'sales_finance': return '/finance'
      default: return '/login'
    }
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={getDashboardRoute()} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={getDashboardRoute()} /> : <Signup />} />
      <Route path="/" element={<Navigate to={getDashboardRoute()} />} />

      <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>} />
      <Route path="/pm/*" element={<ProtectedRoute allowedRoles={['project_manager']}><PMLayout /></ProtectedRoute>} />
      <Route path="/team/*" element={<ProtectedRoute allowedRoles={['team_member']}><TeamLayout /></ProtectedRoute>} />
      <Route path="/finance/*" element={<ProtectedRoute allowedRoles={['sales_finance']}><FinanceLayout /></ProtectedRoute>} />

      <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl">Unauthorized Access</h1></div>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRouter
