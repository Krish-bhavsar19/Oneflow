import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { Plus, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    referenceNo: '',
    date: '',
    customerName: '',
    description: '',
    totalAmount: '',
    projectId: '',
    salesOrderId: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchInvoices();
    fetchProjects();
    fetchSalesOrders();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get('/financial/invoices');
      setInvoices(data);
    } catch (error) {
      toast.error('Failed to fetch invoices');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects');
    }
  };

  const fetchSalesOrders = async () => {
    try {
      const { data } = await axios.get('/financial/sales-orders');
      setSalesOrders(data);
    } catch (error) {
      console.error('Error fetching sales orders');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/financial/invoices/${editingId}`, form);
        toast.success('Invoice updated');
      } else {
        await axios.post('/financial/invoices', form);
        toast.success('Invoice created');
      }
      resetForm();
      fetchInvoices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (inv) => {
    setForm({
      referenceNo: inv.referenceNo,
      date: inv.date,
      customerName: inv.customerName,
      description: inv.description || '',
      totalAmount: inv.totalAmount,
      projectId: inv.projectId || '',
      salesOrderId: inv.salesOrderId || '',
      status: inv.status
    });
    setEditingId(inv.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await axios.delete(`/financial/invoices/${id}`);
      toast.success('Invoice deleted');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setForm({
      referenceNo: '',
      date: '',
      customerName: '',
      description: '',
      totalAmount: '',
      projectId: '',
      salesOrderId: '',
      status: 'draft'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customer Invoices</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit' : 'Create'} Invoice
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice No *</label>
                  <input
                    type="text"
                    value={form.referenceNo}
                    onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link to Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">No Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link to Sales Order</label>
                <select
                  value={form.salesOrderId}
                  onChange={(e) => setForm({ ...form, salesOrderId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">No Sales Order</option>
                  {salesOrders.map(so => (
                    <option key={so.id} value={so.id}>{so.referenceNo} - {so.customerName}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{inv.referenceNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{inv.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{parseFloat(inv.totalAmount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {inv.project ? (
                    <span className="flex items-center gap-1 text-blue-600">
                      <LinkIcon size={14} />
                      {inv.project.title}
                    </span>
                  ) : (
                    <span className="text-gray-400">No Project</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(inv)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">No invoices found</div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
