import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchAnalytics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/admin/analytics');
      setAnalytics(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle empty or missing data
  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Unable to load dashboard data</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const projectStatusData = analytics?.projectStats?.map(stat => ({
    name: stat.status.replace('_', ' ').toUpperCase(),
    value: parseInt(stat.count)
  })) || [];

  const taskStatusData = analytics?.taskStats?.map(stat => ({
    name: stat.status.replace('_', ' ').toUpperCase(),
    value: parseInt(stat.count)
  })) || [];

  const expenseData = analytics?.expenseTrends?.map(trend => ({
    month: trend.month,
    amount: parseFloat(trend.total)
  })) || [];

  const totalProjects = projectStatusData.reduce((sum, item) => sum + item.value, 0);
  const totalTasks = taskStatusData.reduce((sum, item) => sum + item.value, 0);
  const completedTasks = taskStatusData.find(s => s.name === 'COMPLETED')?.value || 0;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Check if there's any data
  const hasData = totalProjects > 0 || totalTasks > 0 || expenseData.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Projects"
          value={totalProjects}
          subtitle={`${projectStatusData.find(p => p.name === 'ACTIVE')?.value || 0} active`}
          color="blue"
        />
        <KPICard
          title="Total Tasks"
          value={totalTasks}
          subtitle={`${taskStatusData.find(t => t.name === 'IN_PROGRESS')?.value || 0} in progress`}
          color="purple"
        />
        <KPICard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedTasks} tasks completed`}
          color="green"
        />
        <KPICard
          title="Team Members"
          value={analytics?.userStats?.reduce((sum, u) => sum + parseInt(u.count), 0) || 0}
          subtitle="Active users"
          color="orange"
        />
      </div>

      {/* No Data Message */}
      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <p className="text-blue-900 text-lg font-semibold mb-2">Welcome to OneFlow!</p>
          <p className="text-blue-700 mb-4">Get started by creating your first project</p>
          <button
            onClick={() => window.location.href = '/admin/projects'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Distribution</h2>
          {projectStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No project data available
            </div>
          )}
        </div>

        {/* Task Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status</h2>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No task data available
            </div>
          )}
        </div>
      </div>

      {/* Expense Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Trends (Last 6 Months)</h2>
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No expense data available
          </div>
        )}
      </div>

      {/* Recent Projects & Team Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
          {analytics?.recentProjects?.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentProjects.slice(0, 5).map(project => (
              <div key={project.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manager: {project.manager?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {project.completedTasks}/{project.totalTasks} tasks completed
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <div className="mt-2 w-32">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">{project.progress}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No recent projects
            </div>
          )}
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers (Last 30 Days)</h2>
          {analytics?.teamProductivity?.length > 0 ? (
            <div className="space-y-3">
              {analytics.teamProductivity.slice(0, 5).map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.assignee?.name}</p>
                    <p className="text-xs text-gray-500">{member.assignee?.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{member.tasksCompleted}</p>
                  <p className="text-xs text-gray-500">tasks</p>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No team productivity data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color]}`}></div>
      <div className="p-6">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    planning: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    on_hold: 'bg-orange-100 text-orange-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default Dashboard;
