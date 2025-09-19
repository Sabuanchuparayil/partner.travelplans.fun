import React from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useBookings } from '@/hooks/useBookings';
import { useCustomers } from '@/hooks/useCustomers';
import { useItineraries } from '@/hooks/useItineraries';
import { BriefcaseIcon, TicketIcon, UsersIcon, CheckCircleIcon } from '@/components/shared/icons/Icons';
import DashboardCard from '@/components/shared/DashboardCard';

const DashboardPage: React.FC = () => {
    const { bookings } = useBookings();
    const { customers } = useCustomers();
    const { itineraries } = useItineraries();

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard 
                        title="Itineraries" 
                        value={itineraries.length} 
                        icon={<BriefcaseIcon className="w-8 h-8" />} 
                        linkTo="/itineraries"
                        color="blue"
                    />
                    <DashboardCard 
                        title="Bookings" 
                        value={bookings.length} 
                        icon={<TicketIcon className="w-8 h-8" />} 
                        linkTo="/bookings"
                        color="sky"
                    />
                    <DashboardCard 
                        title="Customers" 
                        value={customers.length} 
                        icon={<UsersIcon className="w-8 h-8" />} 
                        linkTo="/customers"
                        color="teal"
                    />
                     <DashboardCard 
                        title="Compliance" 
                        value={"4/5"} 
                        icon={<CheckCircleIcon className="w-8 h-8" />} 
                        linkTo="/compliance"
                        color="purple"
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
