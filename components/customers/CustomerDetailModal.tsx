import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Customer, CustomerDocument, UserRole } from '../../types';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { UploadIcon, DownloadIcon, PdfFileIcon, DocFileIcon, ImageIcon, GenericFileIcon } from '../shared/icons/Icons';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ customer, onClose }) => {
  const { user: currentUser } = useAuth();
  const { users, bookings, itineraries, addDocumentToCustomer, updateCustomer } = useData();
  const { addToast } = useToast();
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [assignedRmId, setAssignedRmId] = useState(customer.assignedRmId || '');

  useEffect(() => {
    setAssignedRmId(customer.assignedRmId || '');
  }, [customer]);

  const agent = users.find(u => u.id === customer.registeredByAgentId);
  const relationshipManagers = useMemo(() => users.filter(u => u.roles.includes(UserRole.RELATIONSHIP_MANAGER)), [users]);
  const rm = users.find(u => u.id === customer.assignedRmId);
  const customerBookings = bookings.filter(b => b.customerId === customer.id);
  
  const canAssignRm = currentUser?.roles.includes(UserRole.ADMIN) || currentUser?.roles.includes(UserRole.AGENT);

  const statusColors = {
    Confirmed: 'bg-green-100 text-green-800 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Completed: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  
  const getDocumentIcon = (type: CustomerDocument['type']) => {
    const wrapperClass = "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg";
    const iconClass = "w-6 h-6 text-white";

    switch (type) {
      case 'PDF': return <div className={`${wrapperClass} bg-red-500`}><PdfFileIcon className={iconClass} /></div>;
      case 'DOCX': return <div className={`${wrapperClass} bg-blue-500`}><DocFileIcon className={iconClass} /></div>;
      case 'JPG': case 'PNG': return <div className={`${wrapperClass} bg-purple-500`}><ImageIcon className={iconClass} /></div>;
      default: return <div className={`${wrapperClass} bg-gray-500`}><GenericFileIcon className={iconClass} /></div>;
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(event.target.files)]);
    }
  };
  
  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      const fileCount = selectedFiles.length;
      selectedFiles.forEach(file => {
        const docType = file.name.split('.').pop()?.toUpperCase() as CustomerDocument['type'] || 'DOCX';
        addDocumentToCustomer(customer.id, {
          name: file.name,
          type: ['PDF', 'DOCX', 'JPG', 'PNG'].includes(docType) ? docType : 'DOCX',
          uploadDate: new Date().toISOString().split('T')[0],
        });
      });
      setSelectedFiles([]);
      addToast(`${fileCount} document(s) uploaded successfully.`, 'success');
    }
  };
  
  const handleSaveRmAssignment = () => {
    updateCustomer({ ...customer, assignedRmId: assignedRmId || undefined });
    addToast("Relationship Manager updated successfully.", 'success');
  };

  const handleDownload = (doc: CustomerDocument) => {
    const fileContent = `This is a mock document for ${doc.name}.\n\nType: ${doc.type}\nUploaded On: ${doc.uploadDate}\nCustomer: ${customer.firstName} ${customer.lastName}`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <Modal isOpen={!!customer} onClose={onClose} title={`${customer.firstName} ${customer.lastName}`}>
      <div className="space-y-6 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 p-4 border rounded-lg bg-gray-50">
          <div><span className="font-semibold text-gray-600">Email: </span><span className="text-gray-800">{customer.email}</span></div>
          <div><span className="font-semibold text-gray-600">Date of Birth: </span><span className="text-gray-800">{customer.dob}</span></div>
          <div><span className="font-semibold text-gray-600">Registered By: </span><span className="text-gray-800">{agent?.name || 'N/A'}</span></div>
          <div><span className="font-semibold text-gray-600">Registered On: </span><span className="text-gray-800">{new Date(customer.registrationDate).toLocaleDateString()}</span></div>
          <div className="sm:col-span-2"><span className="font-semibold text-gray-600">Assigned RM: </span><span className="text-gray-800">{rm?.name || 'N/A'}</span></div>
        </div>

        {canAssignRm && (
            <div>
                 <h4 className="text-md font-semibold text-gray-800 mb-2">Manage Assignment</h4>
                 <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                    <label htmlFor="rm-assign" className="block text-sm font-medium text-gray-700 whitespace-nowrap">Assign RM:</label>
                    <select 
                        id="rm-assign" 
                        value={assignedRmId} 
                        onChange={(e) => setAssignedRmId(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                        <option value="">-- Unassigned --</option>
                        {relationshipManagers.map(manager => (
                            <option key={manager.id} value={manager.id}>{manager.name}</option>
                        ))}
                    </select>
                    <Button onClick={handleSaveRmAssignment} className="!py-2 !px-3" disabled={assignedRmId === (customer.assignedRmId || '')}>
                        Save
                    </Button>
                 </div>
            </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-3">Booking History</h4>
          {customerBookings.length > 0 ? (
            <div className="space-y-3">
              {customerBookings.map(booking => {
                const itinerary = itineraries.find(it => it.id === booking.itineraryId);
                if (!itinerary) return null;
                const bookingDate = new Date(booking.bookingDate);
                return (
                  <div key={booking.id} className={`p-3 border rounded-lg flex justify-between items-center ${statusColors[booking.status]}`}>
                    <div>
                      <p className="font-bold">{itinerary.title}</p>
                      <p className="text-xs">Booked on: {bookingDate.toLocaleDateString()}</p>
                    </div>
                    <span className="font-semibold">{booking.status}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">No bookings found for this customer.</p>
          )}
        </div>

        <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">Documents</h4>
             <div className="mt-1 mb-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="modal-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="modal-file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.docx"/>
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
              </div>
            </div>
             {selectedFiles.length > 0 && (
                <div className="mb-4">
                    <ul className="mb-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="pl-3 pr-4 py-2 flex items-center justify-between text-sm">
                                <span className="truncate">{file.name}</span>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={handleUpload} className="w-full">Upload {selectedFiles.length} file(s)</Button>
                </div>
            )}

            {customer.documents.length > 0 ? (
                <div className="space-y-3">
                    {customer.documents.map(doc => (
                       <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                         <div className="flex items-center space-x-3 overflow-hidden">
                           {getDocumentIcon(doc.type)}
                           <div className="overflow-hidden">
                             <p className="font-medium text-gray-700 truncate">{doc.name}</p>
                             <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                           </div>
                         </div>
                         <button onClick={() => handleDownload(doc)} title={`Download ${doc.name}`} className="p-2 rounded-md transition-colors bg-blue-100 text-primary hover:bg-blue-200">
                           <DownloadIcon className="w-5 h-5" />
                         </button>
                       </div>
                    ))}
                </div>
            ) : (
                selectedFiles.length === 0 && <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">No documents uploaded for this customer.</p>
            )}
        </div>
        
      </div>
    </Modal>
  );
};

export default CustomerDetailModal;