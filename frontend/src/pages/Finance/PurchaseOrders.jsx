import { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { Plus, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    referenceNo: '',
    date: '',
    supplierName: '',
    description: '',
    totalAmount: '',
    projectId: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchProjects();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const { data } = await axios.get('/financial/purchase-orders');
      setPurchaseOrders(data);
    } catch (error) {
      toast.error('Failed to fetch purchase orders');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/financial/purchase-orders/${editingId}`, form);
        toast.success('Purchase Order updated');
      } else {
        await axios.post('/financial/purchase-orders', form);
        toast.success('Purchase Order created');
      }
      resetForm();
      fetchPurchaseOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (po) => {
    setForm({
      referenceNo: po.referenceNo,
      date: po.date,
      supplierName: po.supplierName,
      description: po.description || '',
      totalAmount: po.totalAmount,
      projectId: po.projectId || '',
      status: po.status
    });
    setEditingId(po.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this purchase order?')) return;
    try {
      await axios.delete(`/financial/purchase-orders/${id}`);
      toast.success('Purchase Order deleted');
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setForm({
      referenceNo: '',
      date: '',
      supplierName: '',
      description: '',
      totalAmount: '',
      projectId: '',
      status: 'draft'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    received: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Create Purchase Order
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? 'Edit' : 'Create'} Purchase Order
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Reference No *</label>
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
                <label className="block text-sm font-medium mb-1">Supplier Name *</label>
                <input
                  type="text"
                  value={form.supplierName}
                  onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
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
                    <option value="received">Received</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrders.map(po => (
              <tr key={po.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{po.referenceNo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(po.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{po.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{parseFloat(po.totalAmount).toLocaleString()}</td>
                <td className="px-6 py-4">
                  {po.project ? (
                    <span className="flex items-center gap-1 text-blue-600">
                      <LinkIcon size={14} />
                      {po.project.title}
                    </span>
                  ) : (
                    <span className="text-gray-400">No Project</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[po.status]}`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(po)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(po.id)}
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
        {purchaseOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">No purchase orders found</div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;
