import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  linkTo: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, linkTo, color }) => {
  const bgColor = `bg-${color}-100`;
  const borderColor = `border-${color}-500`;
  const textColor = `text-${color}-800`;
  const iconColor = `text-${color}-500`;

  return (
    <Link to={linkTo} className="block p-1 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className={`p-6 ${bgColor} border-l-4 ${borderColor} rounded-lg`}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full ${iconColor} bg-white`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <h2 className={`text-xl font-semibold ${textColor}`}>{title}</h2>
                    <p className={`mt-2 text-3xl font-bold ${textColor}`}>{value}</p>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default DashboardCard;
