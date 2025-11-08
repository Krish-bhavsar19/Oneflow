import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { LayoutDashboard, Users, FolderKanban, Settings } from 'lucide-react'
import AdminDashboard from '../pages/Admin/Dashboard'
import ManageUsers from '../pages/Admin/ManageUsers'
import AllProjects from '../pages/Admin/AllProjects'

const AdminLayout = () => {
  const links = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
    { path: '/admin/projects', label: 'All Projects', icon: <FolderKanban size={20} /> },
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
            <Route path="users" element={<ManageUsers />} />
            <Route path="projects" element={<AllProjects />} />
            <Route path="settings" element={<div className="card"><h2 className="text-2xl font-bold">Settings</h2></div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
