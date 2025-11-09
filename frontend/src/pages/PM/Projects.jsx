import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'
import { Plus, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '', status: 'planning' })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/projects')
      setProjects(data)
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/projects', form)
      toast.success('Project created successfully')
      setShowForm(false)
      setForm({ title: '', description: '', startDate: '', endDate: '', status: 'planning' })
      fetchProjects()
    } catch (error) {
      toast.error('Failed to create project')
    }
  }

  const statusColors = {
    planning: 'bg-gray-200 text-gray-700',
    active: 'bg-blue-200 text-blue-700',
    on_hold: 'bg-yellow-200 text-yellow-700',
    completed: 'bg-green-200 text-green-700',
    cancelled: 'bg-red-200 text-red-700'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Create Project
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="input-field" rows="3"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="input-field" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="input-field">
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
                  {project.status}
                </span>
                <button 
                  onClick={() => navigate(`/pm/projects/${project.id}`)} 
                  className="text-blue-600 hover:text-blue-800"
                  title="View Details & Manage Tasks"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-center py-8 text-gray-500">No projects found</p>}
      </div>
    </div>
  )
}

export default Projects
