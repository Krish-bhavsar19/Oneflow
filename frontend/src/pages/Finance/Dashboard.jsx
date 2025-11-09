import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    salesOrders: 0,
    purchaseOrders: 0,
    invoices: 0,
    bills: 0,
    totalRevenue: 0,
    totalCosts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialStats();
  }, []);

  const fetchFinancialStats = async () => {
    try {
      const [so, po, inv, bills] = await Promise.all([
        axios.get('/financial/sales-orders'),
        axios.get('/financial/purchase-orders'),
        axios.get('/financial/invoices'),
        axios.get('/financial/bills')
      ]);

      const totalRevenue = [...so.data, ...inv.data].reduce((sum, item) => 
        sum + parseFloat(item.totalAmount || 0), 0
      );

      const totalCosts = [...po.data, ...bills.data].reduce((sum, item) => 
        sum + parseFloat(item.totalAmount || 0), 0
      );

      setStats({
        salesOrders: so.data.length,
        purchaseOrders: po.data.length,
        invoices: inv.data.length,
        bills: bills.data.length,
        totalRevenue,
        totalCosts
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

  const profit = stats.totalRevenue - stats.totalCosts;
  const profitMargin = stats.totalRevenue > 0 
    ? ((profit / stats.totalRevenue) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage all financial documents</p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <p className="text-red-100 text-sm mb-2">Total Costs</p>
          <p className="text-3xl font-bold">₹{stats.totalCosts.toLocaleString()}</p>
        </div>
        <div className={`bg-gradient-to-br ${profit >= 0 ? 'from-blue-500 to-blue-600' : 'from-gray-500 to-gray-600'} rounded-xl p-6 text-white`}>
          <p className="text-blue-100 text-sm mb-2">Net Profit ({profitMargin}%)</p>
          <p className="text-3xl font-bold">₹{profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="Sales Orders"
          count={stats.salesOrders}
          color="blue"
          onClick={() => navigate('/finance/sales-orders')}
        />
        <QuickActionCard
          title="Purchase Orders"
          count={stats.purchaseOrders}
          color="orange"
          onClick={() => navigate('/finance/purchase-orders')}
        />
        <QuickActionCard
          title="Invoices"
          count={stats.invoices}
          color="green"
          onClick={() => navigate('/finance/invoices')}
        />
        <QuickActionCard
          title="Bills"
          count={stats.bills}
          color="red"
          onClick={() => navigate('/finance/bills')}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Documents</h3>
          <div className="space-y-3">
            <InfoRow label="Sales Orders" value={stats.salesOrders} />
            <InfoRow label="Customer Invoices" value={stats.invoices} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Documents</h3>
          <div className="space-y-3">
            <InfoRow label="Purchase Orders" value={stats.purchaseOrders} />
            <InfoRow label="Vendor Bills" value={stats.bills} />
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, count, color, onClick }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-xl p-6 text-left transition-all hover:shadow-lg`}
    >
      <p className="text-sm opacity-90 mb-2">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm opacity-75 mt-2">View all →</p>
    </button>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default FinanceDashboard;
