import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { motion } from 'framer-motion'

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

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

  const statusColors = {
    todo: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-200 text-blue-700',
    review: 'bg-yellow-200 text-yellow-700',
    completed: 'bg-green-200 text-green-700'
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
      <div className="space-y-4">
        {tasks.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <p className="text-sm text-gray-500 mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="ml-4">
                <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)} className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && <p className="text-gray-500 text-center py-8">No tasks assigned</p>}
      </div>
    </div>
  )
}

export default MyTasks
