import { useData } from '@/context/DataContext';

export const useUsers = () => {
  const { users, addUser, updateUser, suspendUser, toggleUserStatus } = useData();
  return { users, addUser, updateUser, suspendUser, toggleUserStatus };
};