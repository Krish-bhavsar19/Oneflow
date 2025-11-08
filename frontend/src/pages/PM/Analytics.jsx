import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from '../../api/axiosConfig';
import { toast } from 'react-toastify';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  DollarSign,
  FolderKanban,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalHours: 0,
    totalExpenses: 0,
    pendingExpenses: 0
  });
  const [projectData, setProjectData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [projects, tasks, timesheets, expenses] = await Promise.all([
        axios.get('/projects'),
        axios.get('/tasks/all'),
        axios.get('/timesheets/my'),
        axios.get('/expenses/pm-expenses')
      ]);

      // Calculate stats
      const totalHours = timesheets.data.reduce((sum, t) => sum + parseFloat(t.hoursWorked || 0), 0);
      const totalExpenses = expenses.data.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      const pendingExpenses = expenses.data.filter(e => !e.approvedByPm).length;
      const completedTasks = tasks.data.filter(t => t.status === 'completed').length;

      setStats({
        totalProjects: projects.data.length,
        totalTasks: tasks.data.length,
        completedTasks,
        totalHours: totalHours.toFixed(1),
        totalExpenses: totalExpenses.toFixed(2),
        pendingExpenses
      });

      // Project status distribution
      const projectsByStatus = projects.data.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      }, {});

      setProjectData(
        Object.entries(projectsByStatus).map(([status, count]) => ({
          name: status.replace('_', ' ').toUpperCase(),
          value: count
        }))
      );

      // Task status distribution
      const tasksByStatus = tasks.data.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {});

      setTaskStatusData(
        Object.entries(tasksByStatus).map(([status, count]) => ({
          name: status.replace('_', ' ').toUpperCase(),
          count
        }))
      );

      // Monthly hours (mock data - you can enhance this)
      setMonthlyData([
        { month: 'Jan', hours: 120, expenses: 5000 },
        { month: 'Feb', hours: 150, expenses: 6500 },
        { month: 'Mar', hours: 180, expenses: 7200 },
        { month: 'Apr', hours: 160, expenses: 6800 },
        { month: 'May', hours: 200, expenses: 8500 },
        { month: 'Jun', hours: 190, expenses: 8000 }
      ]);

    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const statCards = [
    { 
      title: 'Total Projects', 
      value: stats.totalProjects, 
      icon: <FolderKanban className="w-8 h-8" />, 
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Total Tasks', 
      value: stats.totalTasks, 
      icon: <CheckCircle className="w-8 h-8" />, 
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    { 
      title: 'Completed Tasks', 
      value: stats.completedTasks, 
      icon: <TrendingUp className="w-8 h-8" />, 
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    { 
      title: 'Total Hours', 
      value: stats.totalHours, 
      icon: <Clock className="w-8 h-8" />, 
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    { 
      title: 'Total Expenses', 
      value: `$${stats.totalExpenses}`, 
      icon: <DollarSign className="w-8 h-8" />, 
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    { 
      title: 'Pending Approvals', 
      value: stats.pendingExpenses, 
      icon: <AlertCircle className="w-8 h-8" />, 
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`${card.color} text-white p-4 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Task Status Bar Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tasks by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Projects by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} name="Hours" />
              <Line yAxisId="right" type="monotone" dataKey="expenses" stroke="#10B981" strokeWidth={2} name="Expenses ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-4xl font-bold">
              {stats.totalTasks > 0 ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1) : 0}%
            </p>
            <p className="text-sm mt-2 opacity-90">Tasks completed successfully</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Avg Hours/Project</h3>
            <p className="text-4xl font-bold">
              {stats.totalProjects > 0 ? (stats.totalHours / stats.totalProjects).toFixed(1) : 0}
            </p>
            <p className="text-sm mt-2 opacity-90">Hours per project</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Avg Expense/Project</h3>
            <p className="text-4xl font-bold">
              ${stats.totalProjects > 0 ? (stats.totalExpenses / stats.totalProjects).toFixed(0) : 0}
            </p>
            <p className="text-sm mt-2 opacity-90">Cost per project</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
