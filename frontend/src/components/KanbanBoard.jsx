import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { Plus, User, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const KanbanBoard = ({ projectId }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    in_progress: [],
    review: [],
    completed: []
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    payPerHour: ''
  });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchTeamMembers();
    }
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`/tasks/project/${projectId}`);
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get(`/tasks/team-members/${projectId}`);
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleDragStart = (e, task, status) => {
    setDraggedTask({ ...task, currentStatus: status });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.currentStatus === newStatus) return;

    try {
      await axios.post('/tasks/bulk-update-status', {
        taskId: draggedTask.id,
        newStatus
      });

      // Update local state
      const updatedTasks = { ...tasks };
      updatedTasks[draggedTask.currentStatus] = updatedTasks[draggedTask.currentStatus].filter(
        t => t.id !== draggedTask.id
      );
      updatedTasks[newStatus].push({ ...draggedTask, status: newStatus });
      setTasks(updatedTasks);

      toast.success('Task status updated');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
    setDraggedTask(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks/assign', {
        ...newTask,
        projectId,
        status: 'todo'
      });

      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        estimatedHours: '',
        payPerHour: ''
      });
      setShowAddTask(false);
      fetchTasks();
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId, status) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`/tasks/${taskId}`);
      const updatedTasks = { ...tasks };
      updatedTasks[status] = updatedTasks[status].filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <button
          onClick={() => setShowAddTask(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pay Per Hour ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTask.payPerHour}
                    onChange={(e) => setNewTask({ ...newTask, payPerHour: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className={`${column.color} rounded-lg p-4 min-h-[500px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm">
                {tasks[column.id]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {tasks[column.id]?.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                  className="bg-white p-4 rounded-lg shadow cursor-move hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{task.title}</h4>
                    <button
                      onClick={() => handleDeleteTask(task.id, column.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar size={14} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {(task.estimatedHours || task.payPerHour) && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      {task.estimatedHours > 0 && (
                        <p className="text-xs text-gray-600">Est: {task.estimatedHours}h</p>
                      )}
                      {task.payPerHour > 0 && (
                        <p className="text-xs text-gray-600">Rate: ${task.payPerHour}/h</p>
                      )}
                      {task.loggedHours > 0 && (
                        <p className="text-xs text-blue-600 font-semibold">Logged: {task.loggedHours}h</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
