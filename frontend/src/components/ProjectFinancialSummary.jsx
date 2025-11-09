import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react';

const ProjectFinancialSummary = ({ projectId }) => {
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchFinancials();
    }
  }, [projectId]);

  const fetchFinancials = async () => {
    try {
      const { data } = await axios.get(`/financial/projects/${projectId}/financials`);
      setFinancials(data);
    } catch (error) {
      console.error('Error fetching financials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading financials...</div>;
  }

  if (!financials) {
    return null;
  }

  const { summary, salesOrders, purchaseOrders, invoices, bills, expenses } = financials;

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ₹{summary.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-red-600" size={20} />
            <span className="text-sm text-gray-600">Costs</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            ₹{summary.totalCosts.toLocaleString()}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${summary.profit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={summary.profit >= 0 ? 'text-blue-600' : 'text-red-600'} size={20} />
            <span className="text-sm text-gray-600">Profit</span>
          </div>
          <p className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ₹{summary.profit.toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-purple-600" size={20} />
            <span className="text-sm text-gray-600">Profit Margin</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {summary.profitMargin}%
          </p>
        </div>
      </div>

      {/* Linked Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DocumentCard
          title="Sales Orders"
          count={salesOrders.length}
          total={salesOrders.reduce((sum, so) => sum + parseFloat(so.totalAmount), 0)}
          color="bg-blue-100 text-blue-800"
        />
        <DocumentCard
          title="Purchase Orders"
          count={purchaseOrders.length}
          total={purchaseOrders.reduce((sum, po) => sum + parseFloat(po.totalAmount), 0)}
          color="bg-orange-100 text-orange-800"
        />
        <DocumentCard
          title="Invoices"
          count={invoices.length}
          total={invoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0)}
          color="bg-green-100 text-green-800"
        />
        <DocumentCard
          title="Bills"
          count={bills.length}
          total={bills.reduce((sum, bill) => sum + parseFloat(bill.totalAmount), 0)}
          color="bg-red-100 text-red-800"
        />
      </div>

      {/* Document Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Documents */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3 text-green-700">Revenue Documents</h3>
          <div className="space-y-2">
            {salesOrders.map(so => (
              <div key={`so-${so.id}`} className="flex justify-between text-sm border-b pb-2">
                <span>SO: {so.referenceNo}</span>
                <span className="font-semibold">₹{parseFloat(so.totalAmount).toLocaleString()}</span>
              </div>
            ))}
            {invoices.map(inv => (
              <div key={`inv-${inv.id}`} className="flex justify-between text-sm border-b pb-2">
                <span>Invoice: {inv.referenceNo}</span>
                <span className="font-semibold">₹{parseFloat(inv.totalAmount).toLocaleString()}</span>
              </div>
            ))}
            {salesOrders.length === 0 && invoices.length === 0 && (
              <p className="text-gray-400 text-sm">No revenue documents</p>
            )}
          </div>
        </div>

        {/* Cost Documents */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3 text-red-700">Cost Documents</h3>
          <div className="space-y-2">
            {purchaseOrders.map(po => (
              <div key={`po-${po.id}`} className="flex justify-between text-sm border-b pb-2">
                <span>PO: {po.referenceNo}</span>
                <span className="font-semibold">₹{parseFloat(po.totalAmount).toLocaleString()}</span>
              </div>
            ))}
            {bills.map(bill => (
              <div key={`bill-${bill.id}`} className="flex justify-between text-sm border-b pb-2">
                <span>Bill: {bill.referenceNo}</span>
                <span className="font-semibold">₹{parseFloat(bill.totalAmount).toLocaleString()}</span>
              </div>
            ))}
            {expenses.map(exp => (
              <div key={`exp-${exp.id}`} className="flex justify-between text-sm border-b pb-2">
                <span>Expense: {exp.category}</span>
                <span className="font-semibold">₹{parseFloat(exp.amount).toLocaleString()}</span>
              </div>
            ))}
            {purchaseOrders.length === 0 && bills.length === 0 && expenses.length === 0 && (
              <p className="text-gray-400 text-sm">No cost documents</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({ title, count, total, color }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h4 className="text-sm text-gray-600 mb-2">{title}</h4>
    <div className="flex justify-between items-center">
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {count} docs
      </span>
      <span className="text-lg font-bold">₹{total.toLocaleString()}</span>
    </div>
  </div>
);

export default ProjectFinancialSummary;
