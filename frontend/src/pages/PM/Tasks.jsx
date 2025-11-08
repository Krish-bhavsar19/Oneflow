import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { CheckSquare, User, Calendar, FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all') // all, active, in_progress, completed

  useEffect(() => {
    fetchAllTasks()
  }, [])

  const fetchAllTasks = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/tasks/all')
      setTasks(data)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      todo: 'bg-gray-100 text-gray-800',
      active: 'bg-orange-100 text-orange-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800'
    }
    return badges[status] || badges.todo
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Assigned Tasks</h1>
          <div className="text-sm text-gray-600">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'active', 'in_progress', 'review', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(task.status)}`}>
                        {task.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{task.description}</p>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-gray-500">Assigned to:</span>
                          <p className="font-medium text-gray-800">{task.assignee?.name || 'Unassigned'}</p>
                          <p className="text-xs text-gray-500">{task.assignee?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-gray-500">Project:</span>
                          <p className="font-medium text-gray-800">{task.project?.title || 'No project'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-gray-500">Due Date:</span>
                          <p className="font-medium text-gray-800">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No tasks found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {filter === 'all'
                    ? 'No tasks have been assigned yet'
                    : `No tasks with status "${filter.replace('_', ' ')}"`}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Tasks
