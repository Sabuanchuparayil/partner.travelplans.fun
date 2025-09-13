import React, { createContext, useState, ReactNode } from 'react';
import { User, Itinerary, Customer, Booking, ItineraryCollateral, CustomerDocument } from '../types';
import { mockUsers, mockItineraries, mockCustomers, mockBookings } from '../data/mockData';

interface DataContextType {
  users: User[];
  itineraries: Itinerary[];
  customers: Customer[];
  bookings: Booking[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  addItinerary: (itinerary: Omit<Itinerary, 'id'>) => void;
  updateItinerary: (itinerary: Itinerary) => void;
  deleteItinerary: (itineraryId: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'bookingStatus' | 'documents' | 'registrationDate'>) => void;
  updateCustomer: (customer: Customer) => void;
  addDocumentToCustomer: (customerId: string, document: Omit<CustomerDocument, 'id' | 'url'>) => void;
  updateCollateral: (itineraryId: string, collateralId: string, updates: Partial<ItineraryCollateral>) => void;
  deleteCollateral: (itineraryId: string, collateralId: string) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate' | 'status' | 'paymentStatus'>) => void;
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

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const addItinerary = (itinerary: Omit<Itinerary, 'id'>) => {
    const newItinerary: Itinerary = {
        ...itinerary,
        id: `iti-${Date.now()}`,
        description: itinerary.description || '',
        assignedAgentId: itinerary.assignedAgentId || undefined,
        imageUrl: itinerary.imageUrl || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto-format&fit=crop',
    };
    setItineraries(prev => [...prev, newItinerary]);
  };
    
  const updateItinerary = (updatedItinerary: Itinerary) => {
    const payload = {
      ...updatedItinerary,
      assignedAgentId: updatedItinerary.assignedAgentId || undefined,
      imageUrl: updatedItinerary.imageUrl || 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto-format&fit=crop',
    };
    setItineraries(prev => prev.map(it => it.id === payload.id ? payload : it));
  };

  const deleteItinerary = (itineraryId: string) => {
    setItineraries(prev => prev.filter(it => it.id !== itineraryId));
  };
  
  const addCustomer = (customer: Omit<Customer, 'id' | 'bookingStatus' | 'documents' | 'registrationDate'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      bookingStatus: 'Pending',
      documents: [],
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setCustomers(prev => [...prev, newCustomer]);
  };
    
  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
    
  const addDocumentToCustomer = (customerId: string, document: Omit<CustomerDocument, 'id'|'url'>) => {
    const newDocument: CustomerDocument = {
        ...document,
        id: `doc-${Date.now()}`,
        url: '#', // Placeholder URL
    };
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, documents: [...c.documents, newDocument] } : c));
  };
  
  const updateCollateral = (itineraryId: string, collateralId: string, updates: Partial<ItineraryCollateral>) => {
    setItineraries(prev => prev.map(itinerary => {
        if (itinerary.id === itineraryId) {
            const updatedCollaterals = itinerary.collaterals.map(collateral => {
                if (collateral.id === collateralId) {
                    return { ...collateral, ...updates };
                }
                return collateral;
            });
            return { ...itinerary, collaterals: updatedCollaterals };
        }
        return itinerary;
    }));
  };

  const deleteCollateral = (itineraryId: string, collateralId: string) => {
    setItineraries(prev => prev.map(itinerary => {
        if (itinerary.id === itineraryId) {
            return { ...itinerary, collaterals: itinerary.collaterals.filter(c => c.id !== collateralId) };
        }
        return itinerary;
    }));
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, ...updates } : booking
    ));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'bookingDate' | 'status' | 'paymentStatus'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      bookingDate: new Date().toISOString(),
      status: 'Pending',
      paymentStatus: 'Unpaid',
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const value = {
    users,
    itineraries,
    customers,
    bookings,
    addUser,
    updateUser,
    deleteUser,
    addItinerary,
    updateItinerary,
    deleteItinerary,
    addCustomer,
    updateCustomer,
    addDocumentToCustomer,
    updateCollateral,
    deleteCollateral,
    updateBooking,
    addBooking
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};