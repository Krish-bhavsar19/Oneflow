import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        admin: '/admin',
        project_manager: '/pm',
        team_member: '/team',
        sales_finance: '/finance'
      };
      navigate(dashboardRoutes[user.role] || '/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OneFlow</h1>
                <p className="text-xs text-gray-500">Plan to Bill in One Place</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Projects from
            <span className="text-blue-600"> Plan to Bill</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete project management system that lets you plan, execute, and bill all in one place.
            Track revenue, costs, and profit for every project.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Free Trial
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            title="Plan"
            description="Create projects, assign tasks, set deadlines, and manage your team efficiently."
            icon="📋"
          />
          <FeatureCard
            title="Execute"
            description="Track progress with Kanban boards, log hours, update status, and manage blockers."
            icon="⚡"
          />
          <FeatureCard
            title="Bill & Track"
            description="Create sales orders, invoices, bills, and track revenue, costs, and profit per project."
            icon="💰"
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-20 bg-white rounded-2xl shadow-lg p-8">
          <StatCard number="100%" label="Project Visibility" />
          <StatCard number="Real-time" label="Updates" />
          <StatCard number="4" label="User Roles" />
          <StatCard number="All-in-One" label="Platform" />
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your projects?</h2>
          <p className="text-xl mb-8 opacity-90">Join teams managing their projects efficiently</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold text-lg shadow-lg transition-all"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 OneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default Home;
