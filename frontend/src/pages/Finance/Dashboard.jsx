import { motion } from 'framer-motion'
import { ShoppingCart, FileText, Receipt, CreditCard } from 'lucide-react'

const FinanceDashboard = () => {
  const cards = [
    { title: 'Sales Orders', value: 0, icon: <ShoppingCart size={32} />, color: 'bg-blue-500' },
    { title: 'Purchase Orders', value: 0, icon: <FileText size={32} />, color: 'bg-green-500' },
    { title: 'Invoices', value: 0, icon: <Receipt size={32} />, color: 'bg-purple-500' },
    { title: 'Bills', value: 0, icon: <CreditCard size={32} />, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Finance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-4 rounded-lg`}>{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FinanceDashboard
