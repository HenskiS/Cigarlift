import { useState } from 'react';
import { useGetCitiesQuery } from '../features/clients/clientsApiSlice';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useUpdateConfigMutation, useRegenerateItineraryMutation } from '../features/drive/itineraryApiSlice';
import { useGetItineraryQuery } from '../features/drive/itineraryApiSlice';
import dayjs from 'dayjs';

export default function CitySelect({ config, city }) {
    const { data, isLoading, isSuccess, isError, error } = useGetCitiesQuery();
    const [updateConfigMutation] = useUpdateConfigMutation();
    const [regenerateItinerary] = useRegenerateItineraryMutation();
    const today = dayjs().format('YYYYMMDD');
    const { data: itinerary } = useGetItineraryQuery(today);

    const handleChange = async (event, newValue) => {
        if (city === 1) {
            // Update the config
            await updateConfigMutation({...config, route: {...config.route, city1: newValue}});
            
            // Regenerate the itinerary if it exists
            if (itinerary) {
                await regenerateItinerary(itinerary);
            }
        } else {
            await updateConfigMutation({...config, route: {...config.route, city2: newValue}});
        }
    };

    if (isSuccess) {
        const options = data;
        return (
            <div className="city-select">
                <Autocomplete
                    disablePortal
                    id={"combo-box-demo"+city}
                    value={city === 1 ? config.route.city1 : config.route.city2}
                    options={options}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label={city === 1 ? "City" : "Next City"} />}
                    onChange={handleChange}
                />
            </div>
        );
    }

    return null;
}