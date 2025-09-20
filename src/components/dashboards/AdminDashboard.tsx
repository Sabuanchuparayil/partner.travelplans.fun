import React from 'react';
import { Link } from 'react-router-dom';
import useData from '@/hooks/useData';
import { Customer } from '@/types';
import { BriefcaseIcon, UsersIcon, CheckCircleIcon, CodeIcon, ShieldCheckIcon, CpuChipIcon, CogIcon, AdjustmentsHorizontalIcon, FireIcon } from '../shared/icons/Icons';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
  link?: string;
  linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, link, linkText }) => (
  <div className={`bg-white p-6 rounded-lg shadow-soft transition-transform transform hover:-translate-y-1`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    {link && (
      <Link to={link} className="text-sm font-medium text-primary mt-4 block">
        {linkText}
      </Link>
    )}
  </div>
);

interface ComplianceProgressProps {
    percentage: number;
}

const ComplianceProgress: React.FC<ComplianceProgressProps> = ({ percentage }) => (
  <div className="bg-white p-6 rounded-lg shadow-soft transition-transform transform hover:-translate-y-1">
    <div className="flex items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="text-orange-accent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">Compliance</p>
        <p className="text-lg font-bold text-gray-900">KYC/AML</p>
      </div>
    </div>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, link }) => (
  <Link to={link} className="bg-white p-6 rounded-lg shadow-soft transition-transform transform hover:-translate-y-1 flex flex-col items-center justify-center text-center">
    <div className="p-3 rounded-full bg-gray-100 text-gray-600">
      {icon}
    </div>
    <p className="text-sm font-medium text-gray-700 mt-4">{title}</p>
  </Link>
);


const AdminDashboard: React.FC = () => {
  const { itineraries, customers, bookings } = useData();
  const recentCustomers: Customer[] = customers.slice(0, 3);

  return (
    <div className="bg-background-neutral min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-slate-gray">Welcome, Suresh Kumar</h1>
          <div className="flex items-center mt-2">
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary-blue text-white mr-2">Admin</span>
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-fresh-green text-white">Customer</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BriefcaseIcon />} title="Itineraries" value={itineraries.length} color="primary-blue" />
        <StatCard icon={<CheckCircleIcon />} title="Bookings" value={bookings.length} color="teal" />
        <StatCard icon={<UsersIcon />} title="Customers" value={customers.length} color="fresh-green" />
        <ComplianceProgress percentage={75} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-dark-slate-gray mb-4">Management Sections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <FeatureCard icon={<CodeIcon />} title="Project Management" link="#" />
          <FeatureCard icon={<ShieldCheckIcon />} title="Security Rules" link="#" />
          <FeatureCard icon={<CpuChipIcon />} title="ML Model Management" link="#" />
          <FeatureCard icon={<CogIcon />} title="Firebase Remote Config" link="#" />
          <FeatureCard icon={<AdjustmentsHorizontalIcon />} title="Firebase App Check" link="#" />
          <FeatureCard icon={<FireIcon />} title="Firebase Extensions" link="#" />
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <Link to="/itineraries/new" className="bg-primary-blue text-white px-4 py-2 rounded-lg shadow-md hover:bg-deep-blue transition-colors">
          + Add Itinerary
        </Link>
        <Link to="/bookings" className="bg-fresh-green text-white px-4 py-2 rounded-lg shadow-md hover:bg-dark-green transition-colors">
          → View Bookings
        </Link>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-soft">
        <h2 className="text-xl font-semibold text-dark-slate-gray mb-4">Recent Activity</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${customer.firstName} ${customer.lastName}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.bookingStatus === 'Confirmed' ? 'bg-fresh-green text-white' : 'bg-orange-accent text-white'
                  }`}>
                    {customer.bookingStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
