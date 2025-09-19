import { useData } from '@/context/DataContext';
import { Itinerary } from '@/types';

export const useItineraries = () => {
    const { itineraries, addItinerary: addItineraryData } = useData();

    const addItinerary = (itinerary: Omit<Itinerary, 'id' | 'collaterals'>) => {
        addItineraryData(itinerary);
    };

    return { itineraries, addItinerary };
};