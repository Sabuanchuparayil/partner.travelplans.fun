import React, { useState } from 'react';
import DashboardLayout from '../components/shared/DashboardLayout';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import { useData } from '../hooks/useData';
import { useToast } from '../hooks/useToast';
import { ItineraryCollateral } from '../types';
import { DownloadIcon } from '../components/shared/icons/Icons';

type CollateralWithItinerary = ItineraryCollateral & {
    itineraryTitle: string;
    itineraryId: string;
};

const CompliancePage: React.FC = () => {
    const { itineraries, updateCollateral, deleteCollateral } = useData();
    const { addToast } = useToast();
    const [collateralToReject, setCollateralToReject] = useState<CollateralWithItinerary | null>(null);

    const pendingCollaterals: CollateralWithItinerary[] = itineraries.flatMap(itinerary => 
        itinerary.collaterals
            .filter(collateral => !collateral.approved)
            .map(collateral => ({ ...collateral, itineraryTitle: itinerary.title, itineraryId: itinerary.id }))
    );
    
    const handleApprove = (itineraryId: string, collateralId: string, collateralName: string) => {
        updateCollateral(itineraryId, collateralId, { approved: true });
        addToast(`"${collateralName}" has been approved.`, 'success');
    };
    
    const handleRejectConfirm = () => {
        if (collateralToReject) {
            deleteCollateral(collateralToReject.itineraryId, collateralToReject.id);
            addToast(`"${collateralToReject.name}" has been rejected and removed.`, 'success');
            setCollateralToReject(null);
        }
    };

    const handleDownload = (collateral: CollateralWithItinerary) => {
        const fileContent = `This is a mock collateral document for review.\n\nName: ${collateral.name}\nItinerary: ${collateral.itineraryTitle}\nType: ${collateral.type}\n\nThis file is for preview purposes only.`;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', collateral.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Compliance Review</h1>
                <Card>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Collaterals</h2>
                    {pendingCollaterals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collateral Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itinerary</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingCollaterals.map(collateral => (
                                        <tr key={collateral.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{collateral.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collateral.itineraryTitle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collateral.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button onClick={() => handleDownload(collateral)} className="p-2 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100" title={`Download preview for ${collateral.name}`}>
                                                    <DownloadIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button onClick={() => handleApprove(collateral.itineraryId, collateral.id, collateral.name)} className="!bg-green-600 hover:!bg-green-700 !py-1 !px-3 text-xs">
                                                    Approve
                                                </Button>
                                                <Button onClick={() => setCollateralToReject(collateral)} className="!bg-red-600 hover:!bg-red-700 !py-1 !px-3 text-xs ml-2">
                                                    Reject
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            No pending collaterals to review.
                        </p>
                    )}
                </Card>
            </div>

            {collateralToReject && (
                <ConfirmationModal
                    isOpen={!!collateralToReject}
                    onClose={() => setCollateralToReject(null)}
                    onConfirm={handleRejectConfirm}
                    title="Reject Collateral"
                    message={`Are you sure you want to reject and remove the collateral "${collateralToReject.name}"? This action cannot be undone.`}
                />
            )}
        </DashboardLayout>
    );
};

export default CompliancePage;