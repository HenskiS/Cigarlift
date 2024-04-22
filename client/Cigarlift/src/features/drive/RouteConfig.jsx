import React, { useState } from 'react'
import { useGetConfigQuery } from './itineraryApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CitySelect from '../../components/CitySelect';

const RouteConfig = () => {
    
    const {
        data: config, isLoading, isError, error, isSuccess
    } = useGetConfigQuery()

    let content
    if (isError) content = <p>{error.error}</p>
    if (isLoading) content = <PulseLoader color='#CCC'/>
    if (isSuccess) {
        content = (
            <div className='info'>
                <span>
                    <label htmlFor="routeLength">Number of Stops: </label>
                    <input type="number" className='stops' id="routeLength" defaultValue={config.route.routeLength} />
                </span>
                <span>
                    <CitySelect config={config} city={1}/>
                    <CitySelect config={config} city={2}/>
                </span>
            </div>
        )
    }
        
    return (
        <div className='routeconfig'>
            <h3>Route Config</h3>
            {content}
        </div>
    )
}

export default RouteConfig