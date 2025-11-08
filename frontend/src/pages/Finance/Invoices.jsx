import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Plus } from 'lucide-react'

const Invoices = () => {
  const [invoices, setInvoices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ referenceNo: '', date: '', customerName: '', totalAmount: '', status: 'draft' })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get('/invoices')
      setInvoices(data)
    } catch (error) {
      toast.error('Failed to fetch invoices')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/invoices', form)
      toast.success('Invoice created')
      setShowForm(false)
      setForm({ referenceNo: '', date: '', customerName: '', totalAmount: '', status: 'draft' })
      fetchInvoices()
    } catch (error) {
      toast.error('Failed to create invoice')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Create Invoice
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">Create Invoice</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reference No</label>
                <input type="text" value={form.referenceNo} onChange={(e) => setForm({...form, referenceNo: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input type="text" value={form.customerName} onChange={(e) => setForm({...form, customerName: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Amount</label>
              <input type="number" step="0.01" value={form.totalAmount} onChange={(e) => setForm({...form, totalAmount: e.target.value})} className="input-field" required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Ref No</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Customer</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-b">
                <td className="py-3">{invoice.referenceNo}</td>
                <td className="py-3">{new Date(invoice.date).toLocaleDateString()}</td>
                <td className="py-3">{invoice.customerName}</td>
                <td className="py-3">${invoice.totalAmount}</td>
                <td className="py-3"><span className="px-2 py-1 bg-gray-200 rounded text-sm">{invoice.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p className="text-center py-8 text-gray-500">No invoices</p>}
      </div>
    </div>
  )
}

export default Invoices
