import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, FolderKanban, CheckSquare, DollarSign } from 'lucide-react'
import axios from '../../api/axiosConfig'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, projects: 0, tasks: 0, expenses: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, projects] = await Promise.all([
          axios.get('/users'),
          axios.get('/projects')
        ])
        setStats({
          users: users.data.length,
          projects: projects.data.length,
          tasks: 0,
          expenses: 0
        })
      } catch (error) {
        console.error(error)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { title: 'Total Users', value: stats.users, icon: <Users size={32} />, color: 'bg-blue-500' },
    { title: 'Total Projects', value: stats.projects, icon: <FolderKanban size={32} />, color: 'bg-green-500' },
    { title: 'Total Tasks', value: stats.tasks, icon: <CheckSquare size={32} />, color: 'bg-purple-500' },
    { title: 'Total Expenses', value: stats.expenses, icon: <DollarSign size={32} />, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-4 rounded-lg`}>{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
