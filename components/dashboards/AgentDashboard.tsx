import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import Card from '../shared/Card';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import CreateCustomerModal from '../customers/CreateCustomerModal';
import { Booking } from '../../types';

type BookingStatus = Booking['status'];

const AgentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { itineraries, customers, bookings } = useData();

  const [showTerms, setShowTerms] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'All' | BookingStatus>('All');
  
  const agentItineraries = useMemo(() => {
    return itineraries.filter(it => it.assignedAgentId === user?.id || !it.assignedAgentId)
  }, [user, itineraries]);

  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('agentTermsAccepted');
    if (!hasAcceptedTerms) {
      setShowTerms(true);
    }
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem('agentTermsAccepted', 'true');
    setShowTerms(false);
  };
  
  const agentItinerariesWithBookings = useMemo(() => {
    if (!user) return [];

    const agentCustomers = customers.filter(c => c.registeredByAgentId === user.id);
    const agentCustomerIds = new Set(agentCustomers.map(c => c.id));
    const agentBookings = bookings.filter(b => agentCustomerIds.has(b.customerId));

    return agentItineraries.map(itinerary => {
      const bookingsForItinerary = agentBookings.filter(b => b.itineraryId === itinerary.id);
      const bookingCounts = {
        Pending: bookingsForItinerary.filter(b => b.status === 'Pending').length,
        Confirmed: bookingsForItinerary.filter(b => b.status === 'Confirmed').length,
        Completed: bookingsForItinerary.filter(b => b.status === 'Completed').length,
      };
      return {
        ...itinerary,
        bookingCounts,
      };
    });
  }, [user, agentItineraries, customers, bookings]);

  const statusCounts = useMemo(() => {
    const counts: Record<'All' | BookingStatus, number> = {
      All: agentItinerariesWithBookings.length,
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
    };
    agentItinerariesWithBookings.forEach(it => {
        if (it.bookingCounts.Pending > 0) counts.Pending++;
        if (it.bookingCounts.Confirmed > 0) counts.Confirmed++;
        if (it.bookingCounts.Completed > 0) counts.Completed++;
    });
    return counts;
  }, [agentItinerariesWithBookings]);


  const filteredItineraries = useMemo(() => {
    if (filterStatus === 'All') {
      return agentItinerariesWithBookings;
    }
    return agentItinerariesWithBookings.filter(it => it.bookingCounts[filterStatus] > 0);
  }, [filterStatus, agentItinerariesWithBookings]);

  const filterButtons: { label: string; value: 'All' | BookingStatus }[] = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
  ];

  const statusBadgeColors: Record<BookingStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-green-100 text-green-800',
    Completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
        <Button onClick={() => setShowRegister(true)}>Register Customer</Button>
      </div>

      <div>
        <div className="md:flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">My Itineraries &amp; Bookings</h2>
            <div className="flex flex-wrap gap-2 rounded-lg bg-gray-200 p-1">
                {filterButtons.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setFilterStatus(value)}
                        className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                            filterStatus === value
                            ? 'bg-white text-primary shadow'
                            : 'text-gray-600 hover:bg-white/60'
                        }`}
                        aria-pressed={filterStatus === value}
                    >
                        <span>{label}</span>
                        <span
                            className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                filterStatus === value
                                ? 'bg-primary text-white'
                                : 'bg-gray-300 text-gray-800'
                            }`}
                        >
                            {statusCounts[value]}
                        </span>
                    </button>
                ))}
            </div>
        </div>
        
        {filteredItineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries.map(it => (
                <Link to={`/itinerary/${it.id}`} key={it.id} className="group block h-full">
                <Card className="overflow-hidden h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 flex flex-col">
                    <img src={it.imageUrl} alt={it.title} className="w-full h-48 object-cover"/>
                    <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{it.title}</h3>
                    <p className="text-sm text-gray-500">{it.destination}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-primary">AED {it.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-600">{it.duration} days</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 mt-4 flex flex-wrap gap-2">
                        { (Object.keys(it.bookingCounts) as BookingStatus[]).map(status => (
                            it.bookingCounts[status] > 0 && (
                                <span key={status} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeColors[status]}`}>
                                    {status}: {it.bookingCounts[status]}
                                </span>
                            )
                        ))}
                        { it.bookingCounts.Pending === 0 && it.bookingCounts.Confirmed === 0 && it.bookingCounts.Completed === 0 && (
                            <span className="text-xs text-gray-400 italic">No bookings from your customers yet.</span>
                        )}
                    </div>
                    </div>
                </Card>
                </Link>
            ))}
            </div>
        ) : (
             <Card>
                <p className="text-center text-gray-500 py-8">
                    No itineraries found for the status "{filterStatus}".
                </p>
            </Card>
        )}
      </div>

      <Modal isOpen={showTerms} onClose={() => {}} title="Terms & General Agreement">
        <div className="text-sm text-gray-600 space-y-4">
          <p>Please read and accept our updated terms and conditions to continue.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleAcceptTerms}>I Accept</Button>
        </div>
      </Modal>

      <CreateCustomerModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
};

export default AgentDashboard;