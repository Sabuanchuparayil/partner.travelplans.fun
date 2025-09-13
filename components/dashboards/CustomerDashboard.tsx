import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { UploadIcon } from '../shared/icons/Icons';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { CustomerDocument } from '../../types';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { customers, bookings, itineraries, addDocumentToCustomer, updateCustomer } = useData();
  const { addToast } = useToast();
  
  const customerData = customers.find(c => c.email === user?.email);

  const [dob, setDob] = useState(customerData?.dob || '');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (customerData) {
      setDob(customerData.dob);
    }
  }, [customerData]);

  const customerBookings = customerData ? bookings.filter(b => b.customerId === customerData.id) : [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(event.target.files)]);
    }
  };

  const handleUpload = () => {
    if (customerData && selectedFiles.length > 0) {
      const fileCount = selectedFiles.length;
      selectedFiles.forEach(file => {
        const docType = file.name.split('.').pop()?.toUpperCase() as CustomerDocument['type'] || 'DOCX';
        addDocumentToCustomer(customerData.id, {
          name: file.name,
          type: ['PDF', 'DOCX', 'JPG', 'PNG'].includes(docType) ? docType : 'DOCX',
          uploadDate: new Date().toISOString().split('T')[0],
        });
      });
      setSelectedFiles([]);
      addToast(`${fileCount} document(s) uploaded successfully.`, 'success');
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerData) {
        updateCustomer({ ...customerData, dob });
        addToast("Your details have been updated successfully.", 'success');
    }
  };

  if (!customerData) {
    return (
        <Card>
            <p className="text-center text-gray-600">Could not find your customer profile. Please contact your agent.</p>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Booking Portal</h1>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>
        {customerBookings.length > 0 ? (
          <div className="space-y-4">
            {customerBookings.map(booking => {
              const itinerary = itineraries.find(it => it.id === booking.itineraryId);
              if (!itinerary) return null;

              const statusColors = {
                Confirmed: 'bg-green-100 text-green-800',
                Pending: 'bg-yellow-100 text-yellow-800',
                Completed: 'bg-blue-100 text-blue-800',
              };

              const paymentStatusColors = {
                Paid: 'bg-green-100 text-green-800',
                Unpaid: 'bg-red-100 text-red-800',
              };
              
              const bookingDate = new Date(booking.bookingDate);

              return (
                <div key={booking.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{itinerary.title}</h3>
                    <p className="text-sm text-gray-500">{itinerary.destination}</p>
                    <p className="text-sm text-gray-500 mt-1">Booked on: {bookingDate.toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[booking.paymentStatus]}`}>
                      {booking.paymentStatus}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">You have no bookings.</p>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Complete Your Booking Details</h2>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" defaultValue={customerData.firstName} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm" readOnly />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" defaultValue={customerData.lastName} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm" readOnly />
                    </div>
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" defaultValue={customerData.email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm" readOnly />
                </div>
                 <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" id="dob" value={dob} onChange={e => setDob(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit">Save Details</Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Documents</h2>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
             {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-md font-medium text-gray-700">Selected files:</h3>
                    <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={handleUpload} className="w-full mt-2">Upload {selectedFiles.length} file(s)</Button>
                </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;