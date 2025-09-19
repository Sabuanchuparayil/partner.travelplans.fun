import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SimpleLoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        await login('test@example.com', 'password');
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">Login</h1>
                <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Login
                </button>
            </div>
        </div>
    );
};

export default SimpleLoginPage;
