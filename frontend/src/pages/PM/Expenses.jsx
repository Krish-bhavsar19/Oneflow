import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Check, X, DollarSign, FileText, ShoppingCart, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/expenses/pm-expenses')
      setExpenses(data)
    } catch (error) {
      toast.error('Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (id, action) => {
    try {
      await axios.put(`/expenses/${id}/pm-approve`, { action })
      toast.success(`${action === 'approve' ? 'Approved' : 'Rejected'} successfully`)
      fetchExpenses()
    } catch (error) {
      toast.error(`Failed to ${action}`)
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'sales_order':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />
      case 'purchase_order':
        return <FileText className="w-5 h-5 text-purple-600" />
      case 'invoice':
        return <Receipt className="w-5 h-5 text-green-600" />
      case 'bill':
        return <DollarSign className="w-5 h-5 text-orange-600" />
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeBadge = (type) => {
    const badges = {
      expense: 'bg-gray-100 text-gray-800',
      sales_order: 'bg-blue-100 text-blue-800',
      purchase_order: 'bg-purple-100 text-purple-800',
      invoice: 'bg-green-100 text-green-800',
      bill: 'bg-orange-100 text-orange-800'
    }
    return badges[type] || badges.expense
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Expenses & Billing Approval</h1>
          <div className="text-sm text-gray-600">
            {expenses.length} total item{expenses.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map(expense => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getTypeIcon(expense.type)}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadge(expense.type)}`}>
                        {expense.type?.replace('_', ' ').toUpperCase() || 'EXPENSE'}
                      </span>
                      {!expense.approvedByPm && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          PENDING PM APPROVAL
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </h3>
                    
                    <p className="text-gray-700 mb-3">{expense.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Submitted by:</span>
                        <span className="ml-2 font-medium text-gray-800">{expense.user?.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Project:</span>
                        <span className="ml-2 font-medium text-gray-800">{expense.project?.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-2 font-medium text-gray-800 capitalize">{expense.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-2 font-medium text-gray-800">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                    {!expense.approvedByPm && expense.status !== 'approved' && expense.status !== 'cancelled' && expense.status !== 'rejected' ? (
                      <>
                        <button 
                          onClick={() => handleApproval(expense.id, 'approve')} 
                          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                        >
                          <Check size={20} /> Approve
                        </button>
                        <button 
                          onClick={() => handleApproval(expense.id, 'reject')} 
                          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                        >
                          <X size={20} /> Reject
                        </button>
                      </>
                    ) : (
                      <div className={`${expense.status === 'rejected' || expense.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} px-6 py-3 rounded-lg flex items-center gap-2 font-medium`}>
                        {expense.status === 'rejected' || expense.status === 'cancelled' ? (
                          <><X size={20} /> Rejected</>
                        ) : (
                          <><Check size={20} /> Approved</>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {expenses.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No pending expenses or billing documents</p>
                <p className="text-sm text-gray-400 mt-2">All expenses have been reviewed</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Expenses
