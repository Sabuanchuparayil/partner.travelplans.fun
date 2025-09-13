import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { HomeIcon, UsersIcon, BriefcaseIcon, UserCheckIcon, FileTextIcon, CheckCircleIcon, DollarSignIcon, SparklesIcon } from './icons/Icons';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavLinks = () => {
    if (!user) return [];

    // Prioritize nav links based on role hierarchy
    if (user.roles.includes(UserRole.ADMIN)) {
      return [
        { icon: <HomeIcon />, label: 'Dashboard', path: '/' },
        { icon: <UsersIcon />, label: 'User Management', path: '/users' },
        { icon: <UsersIcon />, label: 'All Customers', path: '/customers' },
        { icon: <BriefcaseIcon />, label: 'Itineraries', path: '/itineraries' },
        { icon: <DollarSignIcon />, label: 'Bookings', path: '/bookings' },
        { icon: <SparklesIcon />, label: 'AI Itinerary Generator', path: '/generate-itinerary' },
        { icon: <CheckCircleIcon />, label: 'Compliance', path: '/compliance' },
      ];
    }
    if (user.roles.includes(UserRole.AGENT)) {
      return [
        { icon: <HomeIcon />, label: 'Dashboard', path: '/' },
        { icon: <UsersIcon />, label: 'Customers', path: '/customers' },
        { icon: <BriefcaseIcon />, label: 'Itineraries', path: '/itineraries' },
        { icon: <DollarSignIcon />, label: 'Bookings', path: '/bookings' },
      ];
    }
    if (user.roles.includes(UserRole.RELATIONSHIP_MANAGER)) {
      return [
        { icon: <HomeIcon />, label: 'Dashboard', path: '/' },
        { icon: <UserCheckIcon />, label: 'Assigned Customers', path: '/customers' },
      ];
    }
    if (user.roles.includes(UserRole.CUSTOMER)) {
      return [
        { icon: <HomeIcon />, label: 'My Dashboard', path: '/' },
        { icon: <FileTextIcon />, label: 'Documents', path: '/documents' },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="hidden md:flex flex-col w-64 bg-sidebar text-white">
      <div className="flex items-center justify-center h-20 border-b border-sidebar-accent">
        <h1 className="text-2xl font-bold text-white">Travelplans.fun</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-10">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center mt-4 py-3 px-6 text-gray-300 hover:bg-sidebar-accent hover:text-white transition-colors ${location.pathname === link.path ? 'bg-sidebar-accent' : ''}`}
            >
              {link.icon}
              <span className="mx-3">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;