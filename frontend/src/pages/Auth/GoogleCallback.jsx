import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axiosConfig';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                toast.error('Google authentication failed');
                navigate('/login');
                return;
            }

            if (token) {
                try {
                    // Store token
                    localStorage.setItem('token', token);

                    // Fetch user profile
                    const { data } = await axios.get('/auth/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (data.success) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        toast.success('Login successful!');

                        // Redirect based on role with page reload
                        const roleRoutes = {
                            admin: '/admin',
                            project_manager: '/pm',
                            team_member: '/team',
                            sales_finance: '/finance'
                        };

                        // Use window.location for hard redirect to reload AuthContext
                        window.location.href = roleRoutes[data.user.role] || '/team';
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Callback error:', error);
                    toast.error('Authentication failed. Please try again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700">Completing authentication...</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
