import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { LayoutDashboard, CheckSquare, Clock, DollarSign, BarChart3 } from 'lucide-react'
import TeamDashboard from '../pages/Team/Dashboard'
import MyTasks from '../pages/Team/MyTasks'
import MyTimesheets from '../pages/Team/MyTimesheets'
import MyExpenses from '../pages/Team/MyExpenses'
import TeamAnalytics from '../pages/Team/Analytics'

const TeamLayout = () => {
  const links = [
    { path: '/team', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/team/tasks', label: 'My Tasks', icon: <CheckSquare size={20} /> },
    { path: '/team/timesheets', label: 'My Timesheets', icon: <Clock size={20} /> },
    { path: '/team/expenses', label: 'My Expenses', icon: <DollarSign size={20} /> },
    { path: '/team/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<TeamDashboard />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="timesheets" element={<MyTimesheets />} />
            <Route path="expenses" element={<MyExpenses />} />
            <Route path="analytics" element={<TeamAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default TeamLayout
