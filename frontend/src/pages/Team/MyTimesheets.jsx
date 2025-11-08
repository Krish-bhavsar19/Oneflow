import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Plus } from 'lucide-react'

const MyTimesheets = () => {
  const [timesheets, setTimesheets] = useState([])
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ projectId: '', date: '', hoursWorked: '', description: '' })

  useEffect(() => {
    fetchTimesheets()
    fetchProjects()
  }, [])

  const fetchTimesheets = async () => {
    try {
      const { data } = await axios.get('/timesheets/my')
      setTimesheets(data)
    } catch (error) {
      toast.error('Failed to fetch timesheets')
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
      await axios.post('/timesheets', form)
      toast.success('Hours logged successfully')
      setShowForm(false)
      setForm({ projectId: '', date: '', hoursWorked: '', description: '' })
      fetchTimesheets()
    } catch (error) {
      toast.error('Failed to log hours')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Timesheets</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Log Hours
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">Log Work Hours</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project</label>
              <select value={form.projectId} onChange={(e) => setForm({...form, projectId: e.target.value})} className="input-field" required>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <input type="number" step="0.5" value={form.hoursWorked} onChange={(e) => setForm({...form, hoursWorked: e.target.value})} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" rows="3"></textarea>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Project</th>
              <th className="text-left py-3">Hours</th>
              <th className="text-left py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(t => (
              <tr key={t.id} className="border-b">
                <td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
                <td className="py-3">{t.project?.title}</td>
                <td className="py-3">{t.hoursWorked}h</td>
                <td className="py-3">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {timesheets.length === 0 && <p className="text-center py-8 text-gray-500">No timesheets logged</p>}
      </div>
    </div>
  )
}

export default MyTimesheets
