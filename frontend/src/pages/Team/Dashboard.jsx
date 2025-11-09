import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const TeamDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    tasks: [],
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/tasks/assigned');
      
      const totalHours = data.reduce((sum, task) => sum + parseFloat(task.loggedHours || 0), 0);
      const totalEarnings = data.reduce((sum, task) => 
        sum + (parseFloat(task.loggedHours || 0) * parseFloat(task.payPerHour || 0)), 0
      );

      setStats({
        tasks: data.slice(0, 5),
        totalTasks: data.length,
        inProgress: data.filter(t => t.status === 'in_progress').length,
        completed: data.filter(t => t.status === 'completed').length,
        totalHours,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your tasks and progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle="Assigned to you"
          color="blue"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Active tasks"
          color="orange"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Tasks done"
          color="green"
        />
        <StatCard
          title="Hours Logged"
          value={stats.totalHours.toFixed(1)}
          subtitle={`₹${stats.totalEarnings.toLocaleString()} earned`}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/team/tasks')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 text-left hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold mb-2">View My Tasks</h3>
          <p className="opacity-90">See all tasks assigned to you</p>
        </button>
        <button
          onClick={() => navigate('/team/timesheets')}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-8 text-left hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold mb-2">My Timesheets</h3>
          <p className="opacity-90">Track your working hours</p>
        </button>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <button
            onClick={() => navigate('/team/tasks')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {stats.tasks.map(task => (
            <div
              key={task.id}
              className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.project?.title}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  {task.estimatedHours > 0 && (
                    <span>Est: {task.estimatedHours}h</span>
                  )}
                  {task.loggedHours > 0 && (
                    <span>Logged: {task.loggedHours}h</span>
                  )}
                  {task.payPerHour > 0 && (
                    <span>₹{task.payPerHour}/h</span>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6`}>
      <p className="text-sm opacity-90 mb-2">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-75">{subtitle}</p>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    review: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default TeamDashboard;
