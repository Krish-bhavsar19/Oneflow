import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Plus } from 'lucide-react'

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ projectId: '', amount: '', description: '' })

  useEffect(() => {
    fetchExpenses()
    fetchProjects()
  }, [])

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get('/expenses/my')
      setExpenses(data)
    } catch (error) {
      toast.error('Failed to fetch expenses')
    }
  }

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/projects')
      setProjects(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/expenses', form)
      toast.success('Expense submitted successfully')
      setShowForm(false)
      setForm({ projectId: '', amount: '', description: '' })
      fetchExpenses()
    } catch (error) {
      toast.error('Failed to submit expense')
    }
  }

  const statusColors = {
    pending: 'bg-yellow-200 text-yellow-700',
    approved: 'bg-green-200 text-green-700',
    rejected: 'bg-red-200 text-red-700'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Expenses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Submit Expense
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">Submit Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <select value={form.projectId} onChange={(e) => setForm({...form, projectId: e.target.value})} className="input-field" required>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" rows="3" required></textarea>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {expenses.map(expense => (
          <div key={expense.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">${expense.amount}</h3>
                <p className="text-gray-600 mt-1">{expense.description}</p>
                <p className="text-sm text-gray-500 mt-2">Project: {expense.project?.title}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[expense.status]}`}>
                {expense.status}
              </span>
            </div>
          </div>
        ))}
        {expenses.length === 0 && <p className="text-center py-8 text-gray-500">No expenses submitted</p>}
      </div>
    </div>
  )
}

export default MyExpenses
