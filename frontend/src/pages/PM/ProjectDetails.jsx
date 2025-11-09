import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import KanbanBoard from '../../components/KanbanBoard';
import ProjectFinancialSummary from '../../components/ProjectFinancialSummary';
import { ArrowLeft, Users, Calendar } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const { data } = await axios.get(`/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/pm/projects')}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Project Manager</p>
              <p className="font-semibold">{project.manager?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Timeline</p>
              <p className="font-semibold">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Financial Overview</h2>
        <ProjectFinancialSummary projectId={id} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <KanbanBoard projectId={id} />
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    planning: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    on_hold: 'bg-orange-100 text-orange-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default ProjectDetails;
