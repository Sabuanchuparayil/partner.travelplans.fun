import { useData } from '@/context/DataContext';
import { Customer } from '@/types';

export const useCustomers = () => {
    const { customers, addCustomer: addCustomerData } = useData();

    const addCustomer = (customer: Omit<Customer, 'id' | 'registrationDate' | 'bookingStatus' | 'documents'>) => {
        addCustomerData(customer);
    };

    return { customers, addCustomer };
};