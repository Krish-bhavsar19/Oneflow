import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { motion } from 'framer-motion'
import { Clock, DollarSign, Calendar, FolderKanban } from 'lucide-react'

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingHours, setEditingHours] = useState(null)
  const [hoursInput, setHoursInput] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/tasks/assigned')
      setTasks(data)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/tasks/${id}/status`, { status })
      toast.success('Task status updated')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const updateLoggedHours = async (taskId) => {
    try {
      await axios.put(`/tasks/${taskId}/logged-hours`, { loggedHours: parseFloat(hoursInput) })
      toast.success('Hours logged successfully')
      setEditingHours(null)
      setHoursInput('')
      fetchTasks()
    } catch (error) {
      toast.error('Failed to log hours')
    }
  }

  const statusColors = {
    todo: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-200 text-blue-700',
    review: 'bg-yellow-200 text-yellow-700',
    completed: 'bg-green-200 text-green-700'
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Assigned Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">
            {tasks.filter(t => t.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {tasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id} 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: i * 0.05 }} 
            className="card"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>
              <div className="ml-4">
                <select 
                  value={task.status} 
                  onChange={(e) => updateStatus(task.id, e.target.value)} 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FolderKanban size={16} />
                <span>{task.project?.title || 'No Project'}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {task.estimatedHours > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>Est: {task.estimatedHours}h</span>
                </div>
              )}
              {task.payPerHour > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} />
                  <span>${task.payPerHour}/h</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span className="text-sm font-semibold">
                  Logged: {task.loggedHours || 0}h
                </span>
              </div>
              
              {editingHours === task.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={hoursInput}
                    onChange={(e) => setHoursInput(e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                    placeholder="Hours"
                  />
                  <button
                    onClick={() => updateLoggedHours(task.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingHours(null)
                      setHoursInput('')
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingHours(task.id)
                    setHoursInput(task.loggedHours || '')
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  Log Hours
                </button>
              )}

              {task.payPerHour > 0 && task.loggedHours > 0 && (
                <div className="ml-auto">
                  <span className="text-sm text-gray-600">Total Earned: </span>
                  <span className="text-lg font-bold text-green-600">
                    ${(task.loggedHours * task.payPerHour).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-8">No tasks assigned to you yet</p>
        )}
      </div>
    </div>
  )
}

export default MyTasks
