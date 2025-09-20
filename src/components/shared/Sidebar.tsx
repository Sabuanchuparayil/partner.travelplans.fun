import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { HomeIcon, UsersIcon, BriefcaseIcon, FileTextIcon, CheckCircleIcon, TicketIcon, LogoutIcon } from './icons/Icons';
import { Logo } from './Logo';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavLinks = () => {
    if (!user) return [];

    const baseLinks = [
      { icon: <HomeIcon />, label: 'Dashboard', path: '/' },
      { icon: <UsersIcon />, label: 'User Management', path: '/users' },
      { icon: <UsersIcon />, label: 'All Customers', path: '/customers' },
      { icon: <BriefcaseIcon />, label: 'Itineraries', path: '/itineraries' },
      { icon: <TicketIcon />, label: 'Bookings', path: '/bookings' },
      { icon: <CheckCircleIcon />, label: 'Compliance', path: '/compliance' },
      { icon: <FileTextIcon />, label: 'Documents', path: '/documents' },
    ];

    if (user.roles.includes(UserRole.ADMIN)) return baseLinks;
    if (user.roles.includes(UserRole.AGENT)) return baseLinks.filter(link => [
      '/', '/customers', '/itineraries', '/bookings'
    ].includes(link.path));
    if (user.roles.includes(UserRole.RELATIONSHIP_MANAGER)) return baseLinks.filter(link => [
      '/', '/customers'
    ].includes(link.path));
    if (user.roles.includes(UserRole.CUSTOMER)) return [
      { icon: <HomeIcon />, label: 'My Dashboard', path: '/' },
      { icon: <FileTextIcon />, label: 'Documents', path: '/documents' },
    ];

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className={`hidden md:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-dark-slate-gray text-white transition-width duration-300`}>
      <div className="flex items-center justify-center h-20 px-4 border-b border-gray-700">
        <Logo collapsed={isCollapsed} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-6">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center mt-2 py-3 px-6 text-gray-300 hover:bg-deep-blue hover:text-white transition-colors rounded-lg mx-2 ${
                location.pathname === link.path ? 'bg-primary-blue text-white font-bold' : ''
              }`}
              title={isCollapsed ? link.label : ''}
            >
              {link.icon}
              {!isCollapsed && <span className="mx-3">{link.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-700 p-4">
        {user && (
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center ${isCollapsed ? 'hidden' : ''}`}>
                    <img src="https://i.pravatar.cc/40" alt="User Avatar" className="rounded-full w-10 h-10 mr-3"/>
                    <span className="font-semibold">{user.name}</span>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-white" title="Logout">
                    <LogoutIcon />
                </button>
            </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full text-center mt-4 text-gray-400 hover:text-white">
          {isCollapsed ? '»' : '«'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;