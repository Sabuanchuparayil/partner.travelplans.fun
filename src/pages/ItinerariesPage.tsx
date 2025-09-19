import React, { useState } from 'react';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useItineraries } from '@/hooks/useItineraries';
import { Itinerary } from '@/types';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';

const ItinerariesPage: React.FC = () => {
    const { itineraries, addItinerary } = useItineraries();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItinerary, setNewItinerary] = useState({ title: '', destination: '', duration: 0, price: 0, description: '', imageUrl: '' });

    const handleAddItinerary = () => {
        addItinerary(newItinerary);
        setIsModalOpen(false);
        setNewItinerary({ title: '', destination: '', duration: 0, price: 0, description: '', imageUrl: '' });
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Itinerary Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add New Itinerary</Button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {itineraries.map((itinerary: Itinerary) => (
                            <tr key={itinerary.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{itinerary.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itinerary.destination}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{itinerary.duration} days</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${itinerary.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Itinerary">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                        <input type="text" name="destination" id="destination" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewItinerary({ ...newItinerary, destination: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
                        <input type="number" name="duration" id="duration" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewItinerary({ ...newItinerary, duration: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input type="number" name="price" id="price" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewItinerary({ ...newItinerary, price: parseInt(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" name="imageUrl" id="imageUrl" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewItinerary({ ...newItinerary, imageUrl: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" id="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}></textarea>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleAddItinerary}>Save Itinerary</Button>
                    </div>
                </div>
            </Modal>

        </DashboardLayout>
    );
};

export default ItinerariesPage;
