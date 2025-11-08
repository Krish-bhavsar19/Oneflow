import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from '../../api/axiosConfig'

const Timesheets = () => {
  const [timesheets, setTimesheets] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchTimesheets(selectedProject)
    }
  }, [selectedProject])

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/projects')
      setProjects(data)
      if (data.length > 0) setSelectedProject(data[0].id)
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const fetchTimesheets = async (projectId) => {
    try {
      const { data } = await axios.get(`/timesheets/project/${projectId}`)
      setTimesheets(data)
    } catch (error) {
      toast.error('Failed to fetch timesheets')
    }
  }

  const totalHours = timesheets.reduce((sum, t) => sum + parseFloat(t.hoursWorked), 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Team Timesheets</h1>
      
      <div className="card mb-6">
        <label className="block text-sm font-medium mb-2">Select Project</label>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="input-field max-w-md">
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
        <p className="mt-4 text-lg font-semibold">Total Hours: {totalHours.toFixed(2)}h</p>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Team Member</th>
              <th className="text-left py-3">Hours</th>
              <th className="text-left py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map(t => (
              <tr key={t.id} className="border-b">
                <td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
                <td className="py-3">{t.user?.name}</td>
                <td className="py-3">{t.hoursWorked}h</td>
                <td className="py-3">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {timesheets.length === 0 && <p className="text-center py-8 text-gray-500">No timesheets found</p>}
      </div>
    </div>
  )
}

export default Timesheets
