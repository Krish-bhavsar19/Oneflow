import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const FinanceAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/finance/analytics');
      console.log('Finance Analytics:', response.data);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  if (!analytics) {
    return <div className="text-center py-8">No data available</div>;
  }

  const salesOrderData = analytics.salesOrderStats?.map(stat => ({
    name: stat.status.toUpperCase(),
    value: parseInt(stat.count)
  })) || [];

  const invoiceData = analytics.invoiceStats?.map(stat => ({
    name: stat.status.toUpperCase(),
    value: parseInt(stat.count)
  })) || [];

  // Combine revenue and expense trends
  const financialTrends = analytics.revenueTrends?.map((rev, index) => ({
    month: rev.month,
    revenue: parseFloat(rev.revenue || 0),
    expenses: parseFloat(analytics.expenseTrends?.[index]?.expenses || 0)
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
        <p className="text-gray-600 mt-1">Track revenue, expenses, and financial performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Total Revenue"
          value={`₹${parseFloat(analytics.totals?.revenue || 0).toFixed(0)}`}
          subtitle="From sales orders"
          color="blue"
        />
        <KPICard
          title="Total Expenses"
          value={`₹${parseFloat(analytics.totals?.expenses || 0).toFixed(0)}`}
          subtitle="All expenses"
          color="red"
        />
        <KPICard
          title="Net Profit"
          value={`₹${parseFloat(analytics.totals?.profit || 0).toFixed(0)}`}
          subtitle="Revenue - Expenses"
          color="green"
        />
        <KPICard
          title="Pending Expenses"
          value={analytics.pending?.expenses || 0}
          subtitle="Awaiting approval"
          color="orange"
        />
        <KPICard
          title="Pending Invoices"
          value={analytics.pending?.invoices || 0}
          subtitle="Awaiting payment"
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Order Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Order Status</h2>
          {salesOrderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesOrderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesOrderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No sales order data available
            </div>
          )}
        </div>

        {/* Invoice Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h2>
          {invoiceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={invoiceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {invoiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No invoice data available
            </div>
          )}
        </div>
      </div>

      {/* Financial Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses (Last 6 Months)</h2>
        {financialTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No financial trend data available
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Invoices</h3>
          <p className="text-4xl font-bold">₹{parseFloat(analytics.totals?.invoices || 0).toFixed(0)}</p>
          <p className="text-sm mt-2 opacity-90">Invoice amount</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Bills</h3>
          <p className="text-4xl font-bold">₹{parseFloat(analytics.totals?.bills || 0).toFixed(0)}</p>
          <p className="text-sm mt-2 opacity-90">Bill amount</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Profit Margin</h3>
          <p className="text-4xl font-bold">
            {analytics.totals?.revenue > 0 
              ? ((analytics.totals.profit / analytics.totals.revenue) * 100).toFixed(1)
              : 0}%
          </p>
          <p className="text-sm mt-2 opacity-90">Net profit margin</p>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
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

export default FinanceAnalytics;
