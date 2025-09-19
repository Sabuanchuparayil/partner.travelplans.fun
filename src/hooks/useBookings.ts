import { useData } from '@/context/DataContext';
import { Booking } from '@/types';

export const useBookings = () => {
    const { bookings, addBooking: addBookingData } = useData();

    const addBooking = (booking: Omit<Booking, 'id'>) => {
        addBookingData(booking);
    };

    return { bookings, addBooking };
};