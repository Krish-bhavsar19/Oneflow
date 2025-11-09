import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { FolderKanban, User, Calendar, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const { data } = await axios.get('/tasks/all');
      console.log('All tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    active: 'bg-purple-100 text-purple-800'
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('todo')}
            className={`px-4 py-2 rounded-lg ${filter === 'todo' ? 'bg-gray-500 text-white' : 'bg-gray-200'}`}
          >
            To Do ({tasks.filter(t => t.status === 'todo').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg ${filter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            In Progress ({tasks.filter(t => t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Completed ({tasks.filter(t => t.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FolderKanban size={16} />
                <span>{task.project?.title || 'No Project'}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>{task.assignee?.name || 'Unassigned'}</span>
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {task.estimatedHours > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} />
                  <span>Est: {task.estimatedHours}h | Logged: {task.loggedHours || 0}h</span>
                </div>
              )}

              {task.payPerHour > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={16} />
                  <span>${task.payPerHour}/h</span>
                </div>
              )}
            </div>

            {task.payPerHour > 0 && task.loggedHours > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-green-600">
                  Total Earned: ${(task.loggedHours * task.payPerHour).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No tasks found</p>
        </div>
      )}
    </div>
  );
};

export default AllTasks;
