
import React, { useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useUsers } from '@/hooks/useUsers';
import { User, UserStatus } from '@/types';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import UserCard from '@/components/shared/UserCard';
import UserForm from '@/components/forms/UserForm';
import { useToast } from '@/hooks/useToast';

const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, toggleUserStatus } = useUsers();
  const { showToast } = useToast();

  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [userToConfirm, setUserToConfirm] = useState<User | null>(null);

  const handleOpenFormModal = (user?: User) => {
    setUserToEdit(user);
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
    setUserToEdit(undefined);
  };

  const handleUserSubmit = (user: Omit<User, 'id'> | User) => {
    const isUpdating = 'id' in user;
    if (isUpdating) {
      updateUser(user);
      showToast(`User ${user.name} updated successfully!`, 'success');
    } else {
      addUser(user);
      showToast(`User ${user.name} added successfully!`, 'success');
    }
    handleCloseFormModal();
  };

  const handleOpenConfirmModal = (user: User) => {
    setUserToConfirm(user);
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setUserToConfirm(null);
  };

  const handleStatusToggle = () => {
    if (userToConfirm) {
      toggleUserStatus(userToConfirm.id);
      const newStatus = userToConfirm.status === UserStatus.ACTIVE ? 'deactivated' : 'activated';
      showToast(`User ${userToConfirm.name} has been ${newStatus}.`, 'success');
      handleCloseConfirmModal();
    }
  };
  
  const getConfirmationMessage = () => {
    if (!userToConfirm) return '';
    const newStatus = userToConfirm.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate';
    return `Are you sure you want to ${newStatus.toLowerCase()} ${userToConfirm.name}?`;
  };


  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <Button onClick={() => handleOpenFormModal()} className="bg-primary-dark hover:bg-primary-darker text-white">
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => handleOpenFormModal(user)}
            onStatusChange={() => handleOpenConfirmModal(user)}
          />
        ))}
      </div>

      {/* Add/Edit User Modal */}
      <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={userToEdit ? 'Edit User' : 'Add New User'}>
        <UserForm
          onClose={handleCloseFormModal}
          onSubmit={handleUserSubmit}
          userToEdit={userToEdit}
        />
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={handleCloseConfirmModal} title="Confirm Action">
        <p className="text-gray-700 mb-6">{getConfirmationMessage()}</p>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={handleCloseConfirmModal}>Cancel</Button>
          <Button 
            variant={userToConfirm?.status === UserStatus.ACTIVE ? 'danger' : 'primary'}
            onClick={handleStatusToggle}
          >
            {userToConfirm?.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
