import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Plus, Calendar, DollarSign } from 'lucide-react'

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [myProjects, setMyProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
    projectId: '', 
    amount: '', 
    description: '',
    category: 'travel',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchExpenses()
    fetchMyProjects()
  }, [])

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get('/expenses/my')
      setExpenses(data)
    } catch (error) {
      toast.error('Failed to fetch expenses')
    }
  }

  const fetchMyProjects = async () => {
    try {
      // Get tasks assigned to me
      const { data: tasks } = await axios.get('/tasks/assigned')
      
      // Extract unique projects from my tasks
      const projectMap = new Map()
      tasks.forEach(task => {
        if (task.project && !projectMap.has(task.project.id)) {
          projectMap.set(task.project.id, task.project)
        }
      })
      
      const uniqueProjects = Array.from(projectMap.values())
      setMyProjects(uniqueProjects)
      
      if (uniqueProjects.length === 0) {
        toast.info('You are not assigned to any projects yet')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('Failed to fetch your projects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/expenses', form)
      toast.success('Expense submitted successfully')
      setShowForm(false)
      setForm({ 
        projectId: '', 
        amount: '', 
        description: '',
        category: 'travel',
        date: new Date().toISOString().split('T')[0]
      })
      fetchExpenses()
    } catch (error) {
      toast.error('Failed to submit expense')
    }
  }

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
  }

  const getApprovedExpenses = () => {
    return expenses
      .filter(exp => exp.status === 'approved')
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
  }

  const statusColors = {
    pending: 'bg-yellow-200 text-yellow-700',
    approved: 'bg-green-200 text-green-700',
    rejected: 'bg-red-200 text-red-700'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
          <p className="text-gray-600 mt-1">Submit and track your project expenses</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={myProjects.length === 0}
        >
          <Plus size={20} /> Submit Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Submitted</p>
          <p className="text-2xl font-bold text-gray-900">₹{getTotalExpenses().toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Approved</p>
          <p className="text-2xl font-bold text-green-600">₹{getApprovedExpenses().toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
          <p className="text-2xl font-bold text-blue-600">{expenses.length}</p>
        </div>
      </div>

      {/* Info Message if no projects */}
      {myProjects.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            You are not assigned to any projects yet. Expenses can only be submitted for projects you're working on.
          </p>
        </div>
      )}

      {/* Submit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Submit New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project *</label>
                <select 
                  value={form.projectId} 
                  onChange={(e) => setForm({...form, projectId: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Project</option>
                  {myProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Only projects you're assigned to</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select 
                  value={form.category} 
                  onChange={(e) => setForm({...form, category: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                  <option value="supplies">Supplies</option>
                  <option value="software">Software</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={form.amount} 
                  onChange={(e) => setForm({...form, amount: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required 
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={(e) => setForm({...form, date: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3" 
                required
                placeholder="Describe the expense..."
              ></textarea>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Submit Expense
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Expense History</h3>
        <div className="space-y-3">
          {expenses.map(expense => (
            <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign size={20} className="text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      ₹{parseFloat(expense.amount).toLocaleString()}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[expense.status]}`}>
                      {expense.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{expense.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span>Category: {expense.category}</span>
                    <span>Project: {expense.project?.title || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No expenses submitted yet</p>
              <p className="text-sm mt-2">Submit your first expense to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyExpenses
