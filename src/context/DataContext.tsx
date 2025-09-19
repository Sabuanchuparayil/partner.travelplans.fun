
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Itinerary, Customer, Booking, User, ItineraryCollateral, CustomerDocument, UserStatus } from '@/types';
import { generateMockData } from '@/data/mockData';

interface DataContextType {
  itineraries: Itinerary[];
  customers: Customer[];
  bookings: Booking[];
  users: User[];
  loading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'registrationDate' | 'bookingStatus' | 'documents'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addUser: (user: Omit<User, 'id' | 'status'>) => void;
  updateUser: (user: User) => void;
  suspendUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  addItinerary: (itinerary: Omit<Itinerary, 'id' | 'collaterals'>) => void;
  updateCollateral: (itineraryId: string, collateralId: string, updatedCollateral: Partial<ItineraryCollateral>) => void;
  deleteCollateral: (itineraryId: string, collateralId: string) => void;
  getCollateralAiFeedback: (itineraryId: string, collateralId: string) => Promise<void>;
  addDocumentToCustomer: (customerId: string, document: Omit<CustomerDocument, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      itineraries: mockItineraries,
      customers: mockCustomers,
      bookings: mockBookings,
      users: mockUsers,
    } = generateMockData();
    setItineraries(mockItineraries);
    setCustomers(mockCustomers);
    setBookings(mockBookings);
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const addCustomer = (customer: Omit<Customer, 'id' | 'registrationDate' | 'bookingStatus' | 'documents'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `C${Math.random().toString(36).substr(2, 9)}`,
      registrationDate: new Date().toISOString(),
      bookingStatus: 'Pending',
      documents: [],
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
  };

  const addUser = (user: Omit<User, 'id' | 'status'>) => {
    const newUser: User = {
      ...user,
      id: `U${Math.random().toString(36).substr(2, 9)}`,
      status: UserStatus.ACTIVE,
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const suspendUser = (userId: string) => {
    setUsers(users.map(user => user.id === userId ? { ...user, status: UserStatus.SUSPENDED } : user));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE };
      }
      return user;
    }));
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `B${Math.random().toString(36).substr(2, 9)}`,
    };
    setBookings([...bookings, newBooking]);
  };

  const addItinerary = (itinerary: Omit<Itinerary, 'id' | 'collaterals'>) => {
    const newItinerary: Itinerary = {
      ...itinerary,
      id: `I${Math.random().toString(36).substr(2, 9)}`,
      collaterals: [],
    };
    setItineraries([...itineraries, newItinerary]);
  };

  const updateCollateral = (itineraryId: string, collateralId: string, updatedCollateral: Partial<ItineraryCollateral>) => {
    setItineraries(itineraries.map(itinerary => {
      if (itinerary.id === itineraryId) {
        return {
          ...itinerary,
          collaterals: itinerary.collaterals.map(collateral =>
            collateral.id === collateralId ? { ...collateral, ...updatedCollateral } : collateral
          ),
        };
      }
      return itinerary;
    }));
  };

  const deleteCollateral = (itineraryId: string, collateralId: string) => {
    setItineraries(itineraries.map(itinerary => {
      if (itinerary.id === itineraryId) {
        return {
          ...itinerary,
          collaterals: itinerary.collaterals.filter(collateral => collateral.id !== collateralId),
        };
      }
      return itinerary;
    }));
  };

  const getCollateralAiFeedback = async (itineraryId: string, collateralId: string) => {
    // Simulate AI feedback
    const feedback = { issuesFound: true, feedback: "This collateral looks great, but consider adding more images." };
    updateCollateral(itineraryId, collateralId, { aiFeedback: feedback });
  };
  
  const addDocumentToCustomer = (customerId: string, document: Omit<CustomerDocument, 'id'>) => {
    const newDocument: CustomerDocument = {
      ...document,
      id: `D${Math.random().toString(36).substr(2, 9)}`,
    };
    setCustomers(customers.map(customer => {
      if (customer.id === customerId) {
        return { ...customer, documents: [...customer.documents, newDocument] };
      }
      return customer;
    }));
  };

  return (
    <DataContext.Provider
      value={{
        itineraries,
        customers,
        bookings,
        users,
        loading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addUser,
        updateUser,
        suspendUser,
        toggleUserStatus,
        addBooking,
        addItinerary,
        updateCollateral,
        deleteCollateral,
        getCollateralAiFeedback,
        addDocumentToCustomer
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
