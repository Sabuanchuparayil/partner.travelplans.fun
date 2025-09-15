import React, { createContext, useState, ReactNode } from 'react';
// FIX: Import RecommendedItinerary type.
import { User, Itinerary, Customer, Booking, ItineraryCollateral, CustomerDocument, RecommendedItinerary } from '../types';
import { mockUsers, mockItineraries, mockCustomers, mockBookings } from '../data/mockData';

// AI Simulation Helpers
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface DataContextType {
  users: User[];
  itineraries: Itinerary[];
  customers: Customer[];
  bookings: Booking[];
  loading: boolean;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addItinerary: (itinerary: Omit<Itinerary, 'id'>) => Promise<void>;
  updateItinerary: (itinerary: Itinerary) => Promise<void>;
  deleteItinerary: (itineraryId: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'bookingStatus' | 'documents' | 'registrationDate'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  addDocumentToCustomer: (customerId: string, document: Omit<CustomerDocument, 'id' | 'url'>) => Promise<void>;
  updateCollateral: (itineraryId: string, collateralId: string, updates: Partial<ItineraryCollateral>) => Promise<void>;
  deleteCollateral: (itineraryId: string, collateralId: string) => Promise<void>;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate' | 'status' | 'paymentStatus'>) => Promise<void>;
  // AI Features
  generateCustomerSummary: (customer: Customer) => Promise<string>;
  verifyDocumentWithAi: (customerId: string, documentId: string) => Promise<void>;
  getCollateralAiFeedback: (itineraryId: string, collateralId: string) => Promise<void>;
  // FIX: Add getRecommendedItineraries to the context type.
  getRecommendedItineraries: (customerId: string) => Promise<RecommendedItinerary[]>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [itineraries, setItineraries] = useState<Itinerary[]>(mockItineraries);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(false); // No initial loading from DB

  // --- CRUD Functions ---
  const addUser = async (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: `user-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
  };
  const updateUser = async (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const deleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addItinerary = async (itinerary: Omit<Itinerary, 'id'>) => {
    const newItinerary: Itinerary = {
      id: `iti-${Date.now()}`,
      ...itinerary,
      description: itinerary.description || '',
      assignedAgentId: itinerary.assignedAgentId || undefined,
      imageUrl: itinerary.imageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070',
    };
    setItineraries(prev => [...prev, newItinerary]);
  };
  const updateItinerary = async (updatedItinerary: Itinerary) => {
    setItineraries(prev => prev.map(it => it.id === updatedItinerary.id ? updatedItinerary : it));
  };
  const deleteItinerary = async (itineraryId: string) => {
    setItineraries(prev => prev.filter(it => it.id !== itineraryId));
  };
  
  const addCustomer = async (customer: Omit<Customer, 'id' | 'bookingStatus' | 'documents' | 'registrationDate'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      bookingStatus: 'Pending',
      documents: [],
      registrationDate: new Date().toISOString().split('T')[0],
      assignedRmId: customer.assignedRmId || undefined,
    };
    setCustomers(prev => [...prev, newCustomer]);
  };
  const updateCustomer = async (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
    
  const addDocumentToCustomer = async (customerId: string, documentData: Omit<CustomerDocument, 'id'|'url'>) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newDocument: CustomerDocument = { ...documentData, id: `doc-${Date.now()}`, url: '#', verifiedStatus: 'Pending' };
        return { ...c, documents: [...c.documents, newDocument] };
      }
      return c;
    }));
  };
  
  const updateCollateral = async (itineraryId: string, collateralId: string, updates: Partial<ItineraryCollateral>) => {
    setItineraries(prev => prev.map(it => {
      if (it.id === itineraryId) {
        const updatedCollaterals = it.collaterals.map(c => c.id === collateralId ? { ...c, ...updates } : c);
        return { ...it, collaterals: updatedCollaterals };
      }
      return it;
    }));
  };
  const deleteCollateral = async (itineraryId: string, collateralId: string) => {
     setItineraries(prev => prev.map(it => {
      if (it.id === itineraryId) {
        const updatedCollaterals = it.collaterals.filter(c => c.id !== collateralId);
        return { ...it, collaterals: updatedCollaterals };
      }
      return it;
    }));
  };

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updates } : b));
  };

  const addBooking = async (booking: Omit<Booking, 'id' | 'bookingDate' | 'status' | 'paymentStatus'>) => {
    const newBooking: Booking = { ...booking, id: `book-${Date.now()}`, bookingDate: new Date().toISOString(), status: 'Pending', paymentStatus: 'Unpaid' };
    setBookings(prev => [...prev, newBooking]);
  };

  // --- AI Feature Simulations ---
  const generateCustomerSummary = async (customer: Customer): Promise<string> => {
    await sleep(1500);
    const customerBookings = bookings.filter(b => b.customerId === customer.id);
    const summary = `This is an AI-generated summary for ${customer.firstName} ${customer.lastName}.\n\n- Primarily interested in travel to destinations like Dubai and the Andaman Islands, as indicated by their booking history.\n- Has completed ${customerBookings.filter(b => b.status === 'Completed').length} trip(s) and currently has ${customerBookings.filter(b => b.status !== 'Completed').length} active booking(s).\n- Document status: ${customer.documents.length > 0 ? `${customer.documents.length} document(s) on file.` : 'No documents uploaded yet, which may be a blocker for upcoming travel.'}`;
    return summary;
  };

  const verifyDocumentWithAi = async (customerId: string, documentId: string): Promise<void> => {
    await sleep(2000);
     setCustomers(prev => prev.map(c => {
        if (c.id === customerId) {
            const updatedDocuments = c.documents.map(doc => {
              if (doc.id === documentId) {
                let newStatus: CustomerDocument['verifiedStatus'];
                let feedback: string;
                if (doc.name.toLowerCase().includes('passport')) {
                  newStatus = 'Verified';
                  feedback = "AI Analysis: Document appears to be a valid Passport. All key fields like name, DOB, and passport number are clear and legible.";
                } else if (doc.name.toLowerCase().includes('scan') || doc.name.toLowerCase().includes('copy')) {
                  newStatus = 'Rejected';
                  feedback = "AI Analysis: Document is likely a copy or scan, not an original. Image quality is low, and text appears blurry, which could indicate tampering.";
                } else {
                  newStatus = 'Error';
                   feedback = "AI Analysis: Could not determine document type with high confidence. Manual review is required.";
                }
                return { ...doc, verifiedStatus: newStatus, aiFeedback: feedback };
              }
              return doc;
            });
            return {...c, documents: updatedDocuments };
        }
        return c;
    }));
  };

  const getCollateralAiFeedback = async (itineraryId: string, collateralId: string): Promise<void> => {
    await sleep(1200);
    const itinerary = itineraries.find(it => it.id === itineraryId);
    const collateral = itinerary?.collaterals.find(c => c.id === collateralId);
    
    let feedback: { issuesFound: boolean; feedback: string; };
    if (collateral?.name.toLowerCase().includes('promo')) {
        feedback = { issuesFound: true, feedback: "Potential Issue: The collateral name contains 'Promotional', which may imply promises that cannot be guaranteed. Recommend reviewing for claims like 'guaranteed sunshine' or 'once-in-a-lifetime'." };
    } else {
        feedback = { issuesFound: false, feedback: "AI Review: No immediate issues detected. The content appears to be factual and aligns with standard marketing guidelines. Recommend a final human review." };
    }
    await updateCollateral(itineraryId, collateralId, { aiFeedback: feedback });
  };

  // FIX: Implement getRecommendedItineraries function.
  const getRecommendedItineraries = async (customerId: string): Promise<RecommendedItinerary[]> => {
    await sleep(1800);
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return [];

    const customerBookedItineraryIds = new Set(bookings.filter(b => b.customerId === customerId).map(b => b.itineraryId));

    const recommendations: RecommendedItinerary[] = [];

    // Simple logic: recommend up to 2 itineraries they haven't booked.
    const unbookedItineraries = itineraries.filter(it => !customerBookedItineraryIds.has(it.id));

    if (unbookedItineraries.length > 0) {
        recommendations.push({
            itinerary: unbookedItineraries[0],
            reason: `Based on your interest in exciting destinations, you'll love this trip to ${unbookedItineraries[0].destination}.`
        });
    }

    if (unbookedItineraries.length > 1) {
        // Pick from the end for variety
        const secondRec = unbookedItineraries[unbookedItineraries.length - 1];
        recommendations.push({
            itinerary: secondRec,
            reason: `For a change of pace, consider this relaxing escape to ${secondRec.destination}.`
        });
    }

    return recommendations.slice(0, 2); // Ensure we only return max 2
  };


  const value = {
    users, itineraries, customers, bookings, loading,
    addUser, updateUser, deleteUser,
    addItinerary, updateItinerary, deleteItinerary,
    addCustomer, updateCustomer, addDocumentToCustomer,
    updateCollateral, deleteCollateral,
    updateBooking, addBooking,
    // FIX: Expose getRecommendedItineraries through the context.
    generateCustomerSummary, verifyDocumentWithAi, getCollateralAiFeedback, getRecommendedItineraries
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};