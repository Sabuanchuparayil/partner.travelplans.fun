import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Itinerary, CollateralType, UserRole } from '../../types';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';
import { ImageIcon, SparklesIcon } from '../shared/icons/Icons';

interface ItineraryFormProps {
  onClose: () => void;
  onSubmit: (itinerary: any) => void;
  itineraryToEdit?: Itinerary;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onClose, onSubmit, itineraryToEdit }) => {
  const { users } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState<string>('');
  const [collaterals, setCollaterals] = useState<{ id?: string; name: string; type: CollateralType; url: string, approved: boolean }[]>([]);
  const [imageError, setImageError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const agents = users.filter(user => user.roles.includes(UserRole.AGENT));
  const isAdmin = user?.roles.includes(UserRole.ADMIN);

  useEffect(() => {
    if (itineraryToEdit) {
      setTitle(itineraryToEdit.title);
      setDestination(itineraryToEdit.destination);
      setDuration(itineraryToEdit.duration.toString());
      setPrice(itineraryToEdit.price.toString());
      setDescription(itineraryToEdit.description || '');
      setImageUrl(itineraryToEdit.imageUrl);
      setAssignedAgentId(itineraryToEdit.assignedAgentId || '');
      setCollaterals(itineraryToEdit.collaterals);
    } else {
        setTitle('');
        setDestination('');
        setDuration('');
        setPrice('');
        setDescription('');
        setImageUrl('');
        setAssignedAgentId('');
        setCollaterals([]);
    }
    setImageError(false);
    setIsGenerating(false);
  }, [itineraryToEdit]);


  const handleCollateralChange = (index: number, field: string, value: string | boolean) => {
    const newCollaterals = [...collaterals];
    (newCollaterals[index] as any)[field] = value;
    setCollaterals(newCollaterals);
  };

  const addCollateral = () => {
    setCollaterals([...collaterals, { name: '', type: CollateralType.PDF, url: '', approved: !!isAdmin }]);
  };

  const removeCollateral = (index: number) => {
    setCollaterals(collaterals.filter((_, i) => i !== index));
  };

  const handleGenerateImage = async () => {
    if (!destination.trim()) {
        alert("Please enter a destination name to generate an image.");
        return;
    }

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A scenic, high-quality, vibrant photograph representing a travel destination: ${destination}. No text or people.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const dataUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setImageUrl(dataUrl);
            setImageError(false);
        } else {
            throw new Error("Image generation returned no images.");
        }
    } catch (error) {
        console.error("Image generation failed:", error);
        alert("Sorry, we couldn't generate an image for that destination. Please try a different one or provide a URL manually.");
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itineraryData = {
      ...itineraryToEdit,
      title,
      destination,
      duration: Number(duration),
      price: Number(price),
      description,
      imageUrl: imageUrl,
      assignedAgentId: assignedAgentId,
      collaterals: collaterals.map(c => ({...c, id: c.id || `col-${Date.now()}-${Math.random()}` })),
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
       <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input 
            type="text" 
            id="imageUrl" 
            value={imageUrl} 
            onChange={e => {
                setImageUrl(e.target.value);
                setImageError(false);
            }} 
            placeholder="https:// or data:image/..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      
      <div className="p-2 border border-dashed border-gray-300 rounded-md min-h-[150px] flex items-center justify-center bg-gray-50">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt="Itinerary preview" 
            className="max-h-40 w-auto rounded object-cover"
            onError={() => setImageError(true)}
          />
        ) : imageError ? (
          <div className="text-center text-red-500">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400"/>
            <p className="text-sm mt-2">Could not load image. Please check the URL.</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400"/>
            <p className="text-sm mt-2">Enter an image URL or generate one.</p>
             <Button 
                type="button" 
                variant="secondary" 
                onClick={handleGenerateImage}
                disabled={!destination || isGenerating}
                className="text-sm !py-1.5 !px-3 mt-2 inline-flex items-center gap-2"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-4 h-4" />
                        Generate with AI
                    </>
                )}
            </Button>
            <p className="text-xs mt-2">A destination name is required to generate an image.</p>
          </div>
        )}
      </div>

       <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (days)</label>
          <input type="number" id="duration" value={duration} onChange={e => setDuration(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (AED)</label>
          <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
      </div>
      
       <div>
        <label htmlFor="agent" className="block text-sm font-medium text-gray-700">Assign Agent</label>
        <select id="agent" value={assignedAgentId} onChange={e => setAssignedAgentId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            <option value="">Unassigned</option>
            {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
        </select>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-800 mb-2">Collaterals</h3>
        {collaterals.map((collateral, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2 p-2 border rounded-md items-center">
             <input type="text" placeholder="Name" value={collateral.name} onChange={e => handleCollateralChange(index, 'name', e.target.value)} required className="col-span-4 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
             <select value={collateral.type} onChange={e => handleCollateralChange(index, 'type', e.target.value)} className="col-span-3 block w-full pl-2 pr-7 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                {Object.values(CollateralType).map(type => <option key={type} value={type}>{type}</option>)}
             </select>
             <input type="url" placeholder="https://..." value={collateral.url} onChange={e => handleCollateralChange(index, 'url', e.target.value)} required className="col-span-3 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
             <button type="button" onClick={() => removeCollateral(index)} className="col-span-1 text-red-500 hover:text-red-700 text-xl font-bold flex justify-center items-center">×</button>
             <div className="col-span-1 flex items-center justify-center" title={isAdmin ? "Auto-approved for Admins" : "Approval status"}>
                <input type="checkbox" checked={collateral.approved} onChange={e => handleCollateralChange(index, 'approved', e.target.checked)} disabled={isAdmin} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:bg-gray-200 disabled:cursor-not-allowed" />
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addCollateral} className="text-sm !py-1 !px-2 mt-2">Add Collateral</Button>
      </div>

      <div className="pt-5 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Cancel</button>
        <Button type="submit">{itineraryToEdit ? 'Save Changes' : 'Create Itinerary'}</Button>
      </div>
    </form>
  );
};

export default ItineraryForm;