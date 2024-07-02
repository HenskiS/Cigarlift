import {useState} from 'react';
import { useGetCitiesQuery } from '../features/clients/clientsApiSlice';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useUpdateConfigMutation } from '../features/drive/itineraryApiSlice';

export default function CitySelect({ config, city }) {
    
    const { data, isLoading, isSuccess, isError, error } = useGetCitiesQuery()
    const [updateConfigMutation] = useUpdateConfigMutation()
    const [age, setAge] = useState('');

    const handleChange = async (event, newValue) => {
        if (city === 1) {
            await updateConfigMutation({...config, route: {...config.route, city1: newValue}})
        } else {
            await updateConfigMutation({...config, route: {...config.route, city2: newValue}})
        }
    };

    if (isSuccess) {
        const options = data
        return (
        <div className="city-select">
        <Autocomplete
            disablePortal
            id={"combo-box-demo"+city}
            value={city === 1 ? config.route.city1 : config.route.city2}
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label={city === 1? "City" : "Next City"} />}
            onChange={handleChange}
        />
        </div>
        )
    }
}
