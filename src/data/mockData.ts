import { User, UserRole, Itinerary, CollateralType, Customer, Booking, UserStatus } from '../types';

// USERS
export const mockUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Suresh Kumar',
    email: 'suresh@travelplans.fun',
    roles: [UserRole.ADMIN],
    status: UserStatus.ACTIVE,
  },
  {
    id: 'user-agent-1',
    name: 'Arjun',
    email: 'arjun@travelplans.fun',
    roles: [UserRole.AGENT, UserRole.RELATIONSHIP_MANAGER],
    status: UserStatus.ACTIVE,
  },
  {
    id: 'user-customer-1',
    name: 'Sabu',
    email: 'mail@jsabu.com',
    roles: [UserRole.CUSTOMER, UserRole.ADMIN],
    status: UserStatus.ACTIVE,
  },
  {
    id: 'user-rm-1',
    name: 'Rohith',
    email: 'Rohith@travelplans.fun',
    roles: [UserRole.RELATIONSHIP_MANAGER],
    status: UserStatus.ACTIVE,
  },
    {
    id: 'user-agent-2',
    name: 'Sameer',
    email: 'sameer@agent.com',
    roles: [UserRole.AGENT],
    status: UserStatus.ACTIVE,
  },
];

// ITINERARIES
export const mockItineraries: Itinerary[] = [
  {
    id: 'iti-1',
    title: 'Dubai Desert Dreams',
    destination: 'Dubai, UAE',
    duration: 5,
    price: 3500,
    description: 'Experience the magic of the Arabian desert with thrilling dune bashing, traditional Bedouin camps, and starlit dinners.',
    assignedAgentId: 'user-agent-1',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1974&auto=format&fit=crop',
    collaterals: [
      { id: 'col-1-1', name: 'Desert Safari Brochure', type: CollateralType.PDF, url: '#', approved: true },
      { id: 'col-1-3', name: 'Promotional Video', type: CollateralType.VIDEO, url: '#', approved: false },
    ],
  },
  {
    id: 'iti-2',
    title: 'Blissful Bali Retreat',
    destination: 'Bali, Indonesia',
    duration: 8,
    price: 4800,
    description: 'Immerse yourself in the spiritual heart of Bali. Explore lush rice paddies, ancient temples, and vibrant local markets.',
    assignedAgentId: 'user-agent-1',
    imageUrl: 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop',
    collaterals: [
        { id: 'col-2-1', name: 'Full Itinerary', type: CollateralType.PDF, url: '#', approved: true },
    ],
  },
  {
    id: 'iti-3',
    title: 'Andaman Island Hopping',
    destination: 'Andaman & Nicobar, India',
    duration: 7,
    price: 3200,
    description: 'Discover the pristine beaches and turquoise waters of the Andaman Islands. A perfect escape for snorkeling, diving, and pure relaxation in a tropical paradise.',
    imageUrl: 'https://images.unsplash.com/photo-1594922439115-27a3a3d34e6c?q=80&w=1974&auto=format&fit=crop',
    collaterals: [],
  },
  {
    id: 'iti-4',
    title: 'Kerala Backwater Escape',
    destination: 'Kerala, India',
    duration: 6,
    price: 2800,
    description: 'Cruise through the serene backwaters of Kerala on a traditional houseboat. Enjoy local cuisine and breathtaking views of "God\'s Own Country".',
    assignedAgentId: 'user-agent-2',
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop',
    collaterals: [
      { id: 'col-4-2', name: 'Cultural Events Schedule', type: CollateralType.PDF, url: '#', approved: false },
    ],
  },
  {
    id: 'iti-5',
    title: 'Swiss Alps Adventure',
    destination: 'Interlaken, Switzerland',
    duration: 7,
    price: 7500,
    description: 'Embark on a breathtaking journey through the Swiss Alps. Experience thrilling mountain excursions, scenic train rides, and charming alpine villages.',
    assignedAgentId: 'user-agent-2',
    imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop',
    collaterals: [
      { id: 'col-5-1', name: 'Jungfrau Region Guide', type: CollateralType.PDF, url: '#', approved: true },
    ],
  },
  {
    id: 'iti-6',
    title: 'Japanese Cultural Journey',
    destination: 'Tokyo & Kyoto, Japan',
    duration: 10,
    price: 9200,
    description: 'Explore the best of Japan, from the bustling metropolis of Tokyo to the serene temples of Kyoto. A perfect blend of ancient tradition and futuristic innovation.',
    assignedAgentId: 'user-agent-1',
    imageUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop',
    collaterals: [
      { id: 'col-6-1', name: 'Tokyo City Guide', type: CollateralType.PDF, url: '#', approved: false },
      { id: 'col-6-2', name: 'Kyoto Temple Guide', type: CollateralType.PDF, url: '#', approved: true },
    ],
  },
  {
    id: 'iti-7',
    title: 'Egyptian Pharaohs Tour',
    destination: 'Cairo & Luxor, Egypt',
    duration: 8,
    price: 5600,
    description: 'Step back in time to the land of the Pharaohs. Witness the majestic Pyramids of Giza, explore the Valley of the Kings, and cruise the legendary Nile River.',
    imageUrl: 'https://images.unsplash.com/photo-1572252123247-990e3ade9a23?q=80&w=1974&auto=format&fit=crop',
    collaterals: [],
  },
];

// CUSTOMERS
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    firstName: 'Sabu',
    lastName: 'J',
    email: 'mail@jsabu.com',
    dob: '1990-05-15',
    registrationDate: '2025-08-05',
    registeredByAgentId: 'user-agent-1',
    assignedRmId: 'user-rm-1',
    bookingStatus: 'Confirmed',
    documents: [
      { id: 'doc-1', name: 'Passport_Copy.pdf', type: 'PDF', url: '#', uploadDate: '2025-08-10' },
      { id: 'doc-2', name: 'Visa_Scan.jpg', type: 'JPG', url: '#', uploadDate: '2025-08-11' },
    ],
  },
  {
    id: 'cust-2',
    firstName: 'diya',
    lastName: '',
    email: 'diya@diya.com',
    dob: '1985-11-20',
    registrationDate: '2025-08-15',
    registeredByAgentId: 'user-agent-1',
    assignedRmId: 'user-rm-1',
    bookingStatus: 'Pending',
    documents: [],
  },
  {
    id: 'cust-3',
    firstName: 'anand',
    lastName: '',
    email: 'anand@anand.com',
    dob: '1992-02-10',
    registrationDate: '2025-08-02',
    registeredByAgentId: 'user-agent-2',
    bookingStatus: 'Confirmed',
    documents: [
        { id: 'doc-3', name: 'Travel_Insurance.pdf', type: 'PDF', url: '#', uploadDate: '2025-08-03' },
    ],
  }
];

// BOOKINGS
export const mockBookings: Booking[] = [
  { id: 'book-1', customerId: 'cust-1', itineraryId: 'iti-1', bookingDate: '2025-08-15T09:00:00Z', status: 'Confirmed', paymentStatus: 'Paid' },
  { id: 'book-2', customerId: 'cust-1', itineraryId: 'iti-3', bookingDate: '2025-08-20T14:30:00Z', status: 'Completed', paymentStatus: 'Paid' },
  { id: 'book-3', customerId: 'cust-2', itineraryId: 'iti-2', bookingDate: '2025-08-28T11:00:00Z', status: 'Pending', paymentStatus: 'Unpaid' },
  { id: 'book-4', customerId: 'cust-3', itineraryId: 'iti-4', bookingDate: '2025-09-01T18:00:00Z', status: 'Confirmed', paymentStatus: 'Unpaid' },
];

export const generateMockData = () => ({
  itineraries: mockItineraries,
  customers: mockCustomers,
  bookings: mockBookings,
  users: mockUsers,
});