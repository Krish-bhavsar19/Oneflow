import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { LayoutDashboard, FolderKanban, CheckSquare, Clock, DollarSign, BarChart3, UserPlus } from 'lucide-react'
import PMDashboard from '../pages/PM/Dashboard'
import Projects from '../pages/PM/Projects'
import ProjectDetails from '../pages/PM/ProjectDetails'
import Tasks from '../pages/PM/Tasks'
import AssignTasks from '../pages/PM/AssignTasks'
import Timesheets from '../pages/PM/Timesheets'
import Expenses from '../pages/PM/Expenses'
import PMAnalytics from '../pages/PM/Analytics'

const PMLayout = () => {
  const links = [
    { path: '/pm', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/pm/projects', label: 'My Projects', icon: <FolderKanban size={20} /> },
    { path: '/pm/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/pm/assign-tasks', label: 'Assign Tasks', icon: <UserPlus size={20} /> },
    { path: '/pm/timesheets', label: 'Timesheets', icon: <Clock size={20} /> },
    { path: '/pm/expenses', label: 'Expenses', icon: <DollarSign size={20} /> },
    { path: '/pm/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<PMDashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="assign-tasks" element={<AssignTasks />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="analytics" element={<PMAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default PMLayout
