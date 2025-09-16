import React, { useState, useEffect, useMemo } from 'react';
import { Itinerary, UserRole, ItineraryCollateral, CollateralType } from '../../types';
import { useData } from '../../hooks/useData';
import Button from '../shared/Button';
import { ImageIcon, DeleteIcon, FilePlusIcon } from '../shared/icons/Icons';

// Helper function to convert file to Base64 data URL
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

interface ItineraryFormProps {
  onClose: () => void;
  onSubmit: (itinerary: Omit<Itinerary, 'id'> | Itinerary) => void;
  itineraryToEdit?: Itinerary;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onClose, onSubmit, itineraryToEdit }) => {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(7);
  const [price, setPrice] = useState(1000);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Stores data URL
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [assignedAgentId, setAssignedAgentId] = useState<string | undefined>(undefined);
  const [collaterals, setCollaterals] = useState<ItineraryCollateral[]>([]);

  const { users } = useData();
  const agents = useMemo(() => users.filter(u => u.roles.includes(UserRole.AGENT)), [users]);

  useEffect(() => {
    if (itineraryToEdit) {
      setTitle(itineraryToEdit.title);
      setDestination(itineraryToEdit.destination);
      setDuration(itineraryToEdit.duration);
      setPrice(itineraryToEdit.price);
      setDescription(itineraryToEdit.description || '');
      setImageUrl(itineraryToEdit.imageUrl || '');
      setImagePreview(itineraryToEdit.imageUrl || null);
      setAssignedAgentId(itineraryToEdit.assignedAgentId);
      setCollaterals(itineraryToEdit.collaterals || []);
    } else {
        // Reset form for creation
        setTitle('');
        setDestination('');
        setDuration(7);
        setPrice(1000);
        setDescription('');
        setImageUrl('');
        setImagePreview(null);
        setAssignedAgentId(undefined);
        setCollaterals([]);
    }
  }, [itineraryToEdit]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const dataUrl = await toBase64(file);
      setImageUrl(dataUrl);
      setImagePreview(dataUrl);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const dataUrl = await toBase64(file);
        setImageUrl(dataUrl);
        setImagePreview(dataUrl);
      }
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleAddCollateral = () => {
    setCollaterals([
        ...collaterals, 
        { 
            id: `new-${Date.now()}`, 
            name: '', 
            type: CollateralType.PDF, 
            url: '', 
            approved: false 
        }
    ]);
  };

  const handleRemoveCollateral = (index: number) => {
    setCollaterals(collaterals.filter((_, i) => i !== index));
  };
  
  const handleCollateralChange = (index: number, field: keyof ItineraryCollateral, value: string | CollateralType) => {
    const newCollaterals = [...collaterals];
    // Using 'any' for type flexibility, but it's safe within this controlled component
    (newCollaterals[index] as any)[field] = value;
    setCollaterals(newCollaterals);
  };

  const handleCollateralFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const dataUrl = await toBase64(file);
      const newCollaterals = [...collaterals];
      newCollaterals[index] = { 
          ...newCollaterals[index], 
          url: dataUrl, 
          name: newCollaterals[index].name || file.name 
      };
      setCollaterals(newCollaterals);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itineraryData = {
      ...(itineraryToEdit || {}),
      id: itineraryToEdit?.id,
      title,
      destination,
      duration,
      price,
      description,
      imageUrl,
      assignedAgentId,
      collaterals,
    };
    onSubmit(itineraryData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
        <input type="text" id="destination" value={destination} onChange={e => setDestination(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
            <input type="number" id="duration" value={duration} onChange={e => setDuration(Number(e.target.value))} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (AED)</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        {imagePreview ? (
            <div className="mt-1 relative">
                <img src={imagePreview} alt="Itinerary preview" className="w-full h-48 object-cover rounded-md" />
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white/70 p-1 rounded-full text-red-600 hover:bg-white"
                >
                    <DeleteIcon className="w-5 h-5" />
                </button>
            </div>
        ) : (
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
                <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                        >
                            <span>Upload an image</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageFileChange} accept="image/png, image/jpeg" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                </div>
            </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
            Recommended: 16:9 aspect ratio (e.g., 1200x675px). Formats: PNG, JPG.
        </p>
      </div>

      <div>
        <label htmlFor="agent" className="block text-sm font-medium text-gray-700">Assigned Agent</label>
        <select
          id="agent"
          value={assignedAgentId || ''}
          onChange={(e) => setAssignedAgentId(e.target.value || undefined)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          <option value="">-- Unassigned --</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name}</option>
          ))}
        </select>
      </div>

       <div>
        <label className="block text-sm font-medium text-gray-700">Collateral Materials</label>
        <p className="mt-1 text-xs text-gray-500">
            Supported formats: PDF, DOCX, etc.
        </p>
        <div className="mt-2 space-y-2">
            {collaterals.map((collateral, index) => (
                <div key={collateral.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <input
                        type="text"
                        placeholder="Collateral Name"
                        value={collateral.name}
                        onChange={(e) => handleCollateralChange(index, 'name', e.target.value)}
                        className="flex-grow px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                    <select
                        value={collateral.type}
                        onChange={(e) => handleCollateralChange(index, 'type', e.target.value as CollateralType)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                        {Object.values(CollateralType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <label htmlFor={`collateral-upload-${index}`} className="cursor-pointer">
                        <div className="bg-secondary hover:bg-green-600 text-white px-3 py-1.5 rounded-md shadow-sm text-sm font-medium inline-flex items-center">
                           <FilePlusIcon className="w-5 h-5 mr-1" />
                           <span>{collateral.url.startsWith('data:') ? 'Change' : 'Upload'}</span>
                        </div>
                        <input
                            id={`collateral-upload-${index}`}
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleCollateralFileChange(e, index)}
                        />
                    </label>
                    <button type="button" onClick={() => handleRemoveCollateral(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                        <DeleteIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
        <Button type="button" onClick={handleAddCollateral} variant="secondary" className="mt-2 !text-sm !py-1">
            + Add Collateral
        </Button>
      </div>

      <div className="pt-5 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Cancel</button>
        <Button type="submit">{itineraryToEdit ? 'Save Changes' : 'Create Itinerary'}</Button>
      </div>
    </form>
  );
};

export default ItineraryForm;