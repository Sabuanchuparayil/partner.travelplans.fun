import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { useData } from '@/context/DataContext';
import { ItineraryCollateral } from '@/types';

const ItineraryDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { itineraries, updateCollateral, deleteCollateral } = useData();
    const itinerary = itineraries.find(it => it.id === id);

    if (!itinerary) {
        return <p>Itinerary not found.</p>;
    }

    const handleUpdateCollateral = (collateral: ItineraryCollateral) => {
        // Example of updating a collateral
        const updates: Partial<ItineraryCollateral> = {
            // ... updated fields
        };
        updateCollateral(itinerary.id, collateral.id, updates);
    };

    const handleDeleteCollateral = (collateralId: string) => {
        deleteCollateral(itinerary.id, collateralId);
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-800">{itinerary.title}</h1>
            <p className="text-lg text-gray-600">{itinerary.destination}</p>
            
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Collaterals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {itinerary.collaterals?.map(collateral => (
                        <div key={collateral.id} className="border p-4 rounded-lg">
                            <p className="font-bold">{collateral.type}</p>
                            <a href={collateral.url} target="_blank" rel="noopener noreferrer">Link</a>
                            <button onClick={() => handleUpdateCollateral(collateral)}>Update</button>
                            <button onClick={() => handleDeleteCollateral(collateral.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ItineraryDetailPage;
