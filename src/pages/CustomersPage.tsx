import React, { useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

const CustomersPage: React.FC = () => {
    const { customers, addCustomer } = useCustomers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '', dob: '', registeredByAgentId: '' });

    const handleAddCustomer = () => {
        addCustomer(newCustomer);
        setIsModalOpen(false);
        setNewCustomer({ firstName: '', lastName: '', email: '', dob: '', registeredByAgentId: '' });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Customer</Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer: Customer) => (
                            <tr key={customer.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.dob}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.bookingStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="firstName" id="firstName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" name="lastName" id="lastName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" name="dob" id="dob" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewCustomer({ ...newCustomer, dob: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="registeredByAgentId" className="block text-sm font-medium text-gray-700">Registered by Agent ID</label>
                        <input type="text" name="registeredByAgentId" id="registeredByAgentId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewCustomer({ ...newCustomer, registeredByAgentId: e.target.value })} />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleAddCustomer}>Save Customer</Button>
                    </div>
                </div>
            </Modal>

        </DashboardLayout>
    );
};

export default CustomersPage;
