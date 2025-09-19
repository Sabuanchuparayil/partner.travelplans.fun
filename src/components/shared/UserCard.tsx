
import React from 'react';
import { User, UserRole, UserStatus } from '../../types';
import { Edit } from 'lucide-react';
import Switch from './Switch';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onStatusChange: (user: User) => void;
}

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'bg-red-200 text-red-800',
  [UserRole.AGENT]: 'bg-blue-200 text-blue-800',
  [UserRole.CUSTOMER]: 'bg-green-200 text-green-800',
  [UserRole.RELATIONSHIP_MANAGER]: 'bg-orange-200 text-orange-800',
};

const statusBorders: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'border-green-500',
  [UserStatus.SUSPENDED]: 'border-red-500',
  [UserStatus.PENDING]: 'border-yellow-500',
};

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onStatusChange }) => {
  const { name, email, roles, status } = user;

  const handleStatusToggle = () => {
    onStatusChange(user);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${statusBorders[status]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start">
          <img
            src={`https://i.pravatar.cc/150?u=${email}`}
            alt={name}
            className="w-16 h-16 rounded-full mr-4 border-2 border-gray-200"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roles.map(role => (
                <span key={role} className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[role]}`}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => onEdit(user)}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
          title="Edit User"
        >
          <Edit size={20} />
        </button>
      </div>
      
      <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-200">
        <Switch 
          checked={status === UserStatus.ACTIVE}
          onChange={handleStatusToggle}
          label={status === UserStatus.ACTIVE ? 'Active' : 'Inactive'}
        />
      </div>
    </div>
  );
};

export default UserCard;
