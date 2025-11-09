import { useState } from 'react';
import axios from '../../api/axiosConfig';

const TestAPI = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, endpoint) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const { data } = await axios.get(endpoint);
      setResults(prev => ({ ...prev, [name]: { success: true, data } }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { 
          success: false, 
          error: error.response?.data?.message || error.message 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const endpoints = [
    { name: 'Admin Analytics', endpoint: '/admin/analytics' },
    { name: 'All Users', endpoint: '/admin/users' },
    { name: 'All Projects', endpoint: '/admin/projects' },
    { name: 'All Tasks', endpoint: '/tasks/all' },
    { name: 'My Tasks', endpoint: '/tasks/assigned' },
    { name: 'Projects List', endpoint: '/projects' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {endpoints.map(({ name, endpoint }) => (
          <div key={name} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{name}</h3>
              <button
                onClick={() => testEndpoint(name, endpoint)}
                disabled={loading[name]}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading[name] ? 'Testing...' : 'Test'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">GET {endpoint}</p>
            
            {results[name] && (
              <div className={`mt-2 p-3 rounded ${results[name].success ? 'bg-green-50' : 'bg-red-50'}`}>
                {results[name].success ? (
                  <div>
                    <p className="text-green-700 font-semibold mb-2">✓ Success</p>
                    <pre className="text-xs overflow-auto max-h-40">
                      {JSON.stringify(results[name].data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-700 font-semibold">✗ Error</p>
                    <p className="text-sm text-red-600">{results[name].error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
        <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
          <li>Click "Test" on each endpoint to check if it's working</li>
          <li>Green = Success, Red = Error</li>
          <li>Check the response data to see what's being returned</li>
          <li>If you see errors, check the backend console for details</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAPI;
