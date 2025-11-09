import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { LayoutDashboard, ShoppingCart, FileText, Receipt, CreditCard, BarChart3 } from 'lucide-react'
import FinanceDashboard from '../pages/Finance/Dashboard'
import SalesOrders from '../pages/Finance/SalesOrders'
import PurchaseOrders from '../pages/Finance/PurchaseOrders'
import Invoices from '../pages/Finance/Invoices'
import Bills from '../pages/Finance/Bills'
import FinanceAnalytics from '../pages/Finance/Analytics'

const FinanceLayout = () => {
  const links = [
    { path: '/finance', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/finance/sales-orders', label: 'Sales Orders', icon: <ShoppingCart size={20} /> },
    { path: '/finance/purchase-orders', label: 'Purchase Orders', icon: <FileText size={20} /> },
    { path: '/finance/invoices', label: 'Invoices', icon: <Receipt size={20} /> },
    { path: '/finance/bills', label: 'Bills', icon: <CreditCard size={20} /> },
    { path: '/finance/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<FinanceDashboard />} />
            <Route path="sales-orders" element={<SalesOrders />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="bills" element={<Bills />} />
            <Route path="analytics" element={<FinanceAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default FinanceLayout
