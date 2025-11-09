import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { LayoutDashboard, Users, FolderKanban, Settings, CheckSquare, ShoppingCart, FileText, Receipt, CreditCard, BarChart3 } from 'lucide-react'
import AdminDashboard from '../pages/Admin/Dashboard'
import AdminAnalytics from '../pages/Admin/Analytics'
import ManageUsers from '../pages/Admin/ManageUsers'
import AllProjects from '../pages/Admin/AllProjects'
import ProjectDetails from '../pages/Admin/ProjectDetails'
import AllTasks from '../pages/Admin/AllTasks'
import SalesOrders from '../pages/Finance/SalesOrders'
import PurchaseOrders from '../pages/Finance/PurchaseOrders'
import Invoices from '../pages/Finance/Invoices'
import Bills from '../pages/Finance/Bills'
import AdminSettings from '../pages/Admin/Settings'

const AdminLayout = () => {
  const links = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/admin/projects', label: 'Projects', icon: <FolderKanban size={20} /> },
    { path: '/admin/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/admin/sales-orders', label: 'Sales Orders', icon: <ShoppingCart size={20} /> },
    { path: '/admin/purchase-orders', label: 'Purchase Orders', icon: <FileText size={20} /> },
    { path: '/admin/invoices', label: 'Invoices', icon: <Receipt size={20} /> },
    { path: '/admin/bills', label: 'Bills', icon: <CreditCard size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="projects" element={<AllProjects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="tasks" element={<AllTasks />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="sales-orders" element={<SalesOrders />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="bills" element={<Bills />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
