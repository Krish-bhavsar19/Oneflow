import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar = ({ links }) => {
  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-64 bg-white shadow-sm min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  )
}

export default Sidebar
