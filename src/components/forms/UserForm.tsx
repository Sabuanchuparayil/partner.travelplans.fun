
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../types';
import Button from '../shared/Button';
import { User as UserIcon, Mail } from 'lucide-react';

interface UserFormProps {
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id'> | User) => void;
  userToEdit?: User;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, onSubmit, userToEdit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    if (userToEdit) {
      const nameParts = userToEdit.name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(userToEdit.email);
      setRoles(userToEdit.roles || []);
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setRoles([]);
    }
  }, [userToEdit]);

  const handleRoleChange = (role: UserRole) => {
    setRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roles.length === 0) {
      alert('A user must have at least one role.');
      return;
    }
    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      roles,
      status: UserStatus.ACTIVE,
    };

    if (userToEdit) {
        onSubmit({ ...userToEdit, ...userData });
    } else {
        onSubmit(userData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="relative">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 mt-2" />
              <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-transparent sm:text-sm transition duration-150 ease-in-out" />
            </div>
            <div className="relative">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 mt-2" />
              <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-transparent sm:text-sm transition duration-150 ease-in-out" />
            </div>
          </div>
          <div className="mt-4 relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 mt-2.5" />
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-focus focus:border-transparent sm:text-sm transition duration-150 ease-in-out" />
          </div>
        </div>

        <hr className="border-t border-gray-200" />

        {/* Account Settings Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
              {Object.values(UserRole).map(role => (
                <div key={role} className="flex items-center">
                  <input
                    id={`role-${role}`}
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                    className="h-5 w-5 text-primary-dark focus:ring-primary-focus border-gray-300 rounded-sm cursor-pointer"
                  />
                  <label htmlFor={`role-${role}`} className="ml-3 block text-sm text-gray-800 font-medium">{role}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-8 flex justify-end space-x-4">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button type="submit" className="min-w-[120px]">
          {userToEdit ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
