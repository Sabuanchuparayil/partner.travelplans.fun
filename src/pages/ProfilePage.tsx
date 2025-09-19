import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            {user && (
                <div className="mt-6">
                    <p><span className="font-bold">Name:</span> {user.name}</p>
                    <p><span className="font-bold">Email:</span> {user.email}</p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ProfilePage;
