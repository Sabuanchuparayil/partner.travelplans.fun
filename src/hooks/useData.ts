import { useBookings } from './useBookings';
import { useCustomers } from './useCustomers';
import { useItineraries } from './useItineraries';
import { useUsers } from './useUsers';

const useData = () => {
  return {
    ...useBookings(),
    ...useCustomers(),
    ...useItineraries(),
    ...useUsers(),
  };
};

export default useData;
