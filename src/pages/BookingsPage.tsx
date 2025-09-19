import React, { useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useBookings } from '@/hooks/useBookings';
import { Booking } from '@/types';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

const BookingsPage: React.FC = () => {
    const { bookings, addBooking } = useBookings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBooking, setNewBooking] = useState<Omit<Booking, 'id'>>({ customerId: '', itineraryId: '', bookingDate: '', status: 'Pending', paymentStatus: 'Unpaid' });

    const handleAddBooking = () => {
        addBooking(newBooking);
        setIsModalOpen(false);
        setNewBooking({ customerId: '', itineraryId: '', bookingDate: '', status: 'Pending', paymentStatus: 'Unpaid' });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Booking</Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itinerary ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking: Booking) => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.customerId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.itineraryId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.bookingDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.paymentStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Booking">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">Customer ID</label>
                        <input type="text" name="customerId" id="customerId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewBooking({ ...newBooking, customerId: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="itineraryId" className="block text-sm font-medium text-gray-700">Itinerary ID</label>
                        <input type="text" name="itineraryId" id="itineraryId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewBooking({ ...newBooking, itineraryId: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">Booking Date</label>
                        <input type="date" name="bookingDate" id="bookingDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewBooking({ ...newBooking, bookingDate: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="status" name="status" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as Booking['status'] })}> <option value="Pending">Pending</option> <option value="Confirmed">Confirmed</option> <option value="Completed">Completed</option></select>
                    </div>
                    <div>
                        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">Payment Status</label>
                        <select id="paymentStatus" name="paymentStatus" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewBooking({ ...newBooking, paymentStatus: e.target.value as Booking['paymentStatus'] })}> <option value="Unpaid">Unpaid</option> <option value="Paid">Paid</option></select>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleAddBooking}>Save Booking</Button>
                    </div>
                </div>
            </Modal>

        </DashboardLayout>
    );
};

export default BookingsPage;
