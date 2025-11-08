import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Plus } from 'lucide-react'

const Bills = () => {
  const [bills, setBills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ referenceNo: '', date: '', supplierName: '', totalAmount: '', status: 'draft' })

  useEffect(() => {
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const { data } = await axios.get('/bills')
      setBills(data)
    } catch (error) {
      toast.error('Failed to fetch bills')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/bills', form)
      toast.success('Bill created')
      setShowForm(false)
      setForm({ referenceNo: '', date: '', supplierName: '', totalAmount: '', status: 'draft' })
      fetchBills()
    } catch (error) {
      toast.error('Failed to create bill')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Bills</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Create Bill
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">Create Vendor Bill</h3>
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
              <label className="block text-sm font-medium mb-1">Supplier Name</label>
              <input type="text" value={form.supplierName} onChange={(e) => setForm({...form, supplierName: e.target.value})} className="input-field" required />
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
              <th className="text-left py-3">Supplier</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id} className="border-b">
                <td className="py-3">{bill.referenceNo}</td>
                <td className="py-3">{new Date(bill.date).toLocaleDateString()}</td>
                <td className="py-3">{bill.supplierName}</td>
                <td className="py-3">${bill.totalAmount}</td>
                <td className="py-3"><span className="px-2 py-1 bg-gray-200 rounded text-sm">{bill.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {bills.length === 0 && <p className="text-center py-8 text-gray-500">No bills</p>}
      </div>
    </div>
  )
}

export default Bills
