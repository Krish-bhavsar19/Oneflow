import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Clock, DollarSign, AlertCircle, Calendar } from 'lucide-react'
import axios from '../../api/axiosConfig'
import { toast } from 'react-toastify'

const TeamDashboard = () => {
  const [stats, setStats] = useState({ tasks: 0, activeTasks: 0, hours: 0, expenses: 0 })
  const [activeTasks, setActiveTasks] = useState([])

  useEffect(() => {
    fetchStats()
    fetchActiveTasks()
  }, [])

  const fetchStats = async () => {
    try {
      const [tasks, timesheets, expenses] = await Promise.all([
        axios.get('/tasks/assigned'),
        axios.get('/timesheets/my'),
        axios.get('/expenses/my')
      ])
      setStats({
        tasks: tasks.data.length,
        activeTasks: tasks.data.filter(t => t.status === 'active').length,
        hours: timesheets.data.reduce((sum, t) => sum + parseFloat(t.hoursWorked), 0),
        expenses: expenses.data.length
      })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchActiveTasks = async () => {
    try {
      const { data } = await axios.get('/tasks/my-active-tasks')
      setActiveTasks(data)
    } catch (error) {
      toast.error('Failed to fetch active tasks')
    }
  }

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.put(`/tasks/${taskId}/status`, { status: newStatus })
      toast.success('Task status updated')
      fetchActiveTasks()
      fetchStats()
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const cards = [
    { title: 'Active Tasks', value: stats.activeTasks, icon: <AlertCircle size={32} />, color: 'bg-orange-500' },
    { title: 'All Tasks', value: stats.tasks, icon: <CheckSquare size={32} />, color: 'bg-blue-500' },
    { title: 'Hours Logged', value: stats.hours, icon: <Clock size={32} />, color: 'bg-green-500' },
    { title: 'Expenses', value: stats.expenses, icon: <DollarSign size={32} />, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Team Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }} 
            className="card"
          >
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

      {/* Active Tasks Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <AlertCircle className="text-orange-500" />
          My Active Tasks
        </h2>
        
        {activeTasks.length > 0 ? (
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                      </span>
                      <span className="text-gray-500">
                        Project: {task.project?.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No active tasks assigned</p>
            <p className="text-sm mt-2">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamDashboard
