import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Trash2 } from 'lucide-react'

const ManageUsers = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/users')
      setUsers(data)
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  const updateRole = async (id, role) => {
    try {
      await axios.put(`/users/${id}/role`, { role })
      toast.success('User role updated')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await axios.delete(`/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Role</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">
                  <select value={user.role} onChange={(e) => updateRole(user.id, e.target.value)} className="px-3 py-1 border rounded">
                    <option value="admin">Admin</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="team_member">Team Member</option>
                    <option value="sales_finance">Sales/Finance</option>
                  </select>
                </td>
                <td className="py-3">
                  <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageUsers
