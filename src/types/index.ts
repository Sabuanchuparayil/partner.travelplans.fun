export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  RELATIONSHIP_MANAGER = 'relationship_manager',
  CUSTOMER = 'customer',
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  status: UserStatus;
}

export enum CollateralType {
  PDF = 'pdf',
  DOCX = 'docx',
  VIDEO = 'video',
  IMAGE = 'image',
  PPTX = 'pptx',
}

export interface ItineraryCollateral {
  id: string;
  name: string;
  type: CollateralType;
  url: string;
  approved: boolean;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  assignedAgentId?: string;
  imageUrl?: string;
  collaterals?: ItineraryCollateral[];
}

export interface CustomerDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  verifiedStatus?: 'Pending' | 'Verified' | 'Rejected';
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  registrationDate: string;
  registeredByAgentId: string;
  assignedRmId?: string;
  bookingStatus: 'Confirmed' | 'Pending';
  documents?: CustomerDocument[];
}

export interface Booking {
  id: string;
  customerId: string;
  itineraryId: string;
  bookingDate: string;
  status: 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid';
}
