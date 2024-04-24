import React, { useEffect, useState } from 'react'
import { useGetConfigQuery, useUpdateConfigMutation } from './itineraryApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import CitySelect from '../../components/CitySelect';

const RouteConfig = () => {
    
    const {
        data: config, isLoading, isError, error, isSuccess
    } = useGetConfigQuery()

    const [routeLength, setRouteLength] = useState("")
    const [updateConfigMutation] = useUpdateConfigMutation()

    useEffect(() => {
        if (isSuccess) {
            setRouteLength(config?.route?.routeLength);
        }
    }, [isSuccess, config])

    const handleSave = async () => {
        if (routeLength === "" || parseInt(routeLength) <= 0) return alert("Number of Stops must be positive")
        await updateConfigMutation({...config, route: {...config.route, routeLength: parseInt(routeLength)}})
    }

    let content
    if (isError) content = <p>{error.error}</p>
    if (isLoading) content = <PulseLoader color='#CCC'/>
    if (isSuccess) {
        content = (
            <div className='info'>
                <span>
                    <label htmlFor="routeLength">Number of Stops: </label>
                    <input type="number" className='stops' id="routeLength" 
                    value={routeLength} 
                    onChange={e => setRouteLength(e.target.value)}/>
                    <button disabled={routeLength == config.route.routeLength}
                    onClick={handleSave}>Save</button>
                </span>
                    <CitySelect config={config} city={1}/>
                    <CitySelect config={config} city={2}/>
                
            </div>
        )
    }
        
    return (
        <div className='routeconfig'>
            <h2>Route Config</h2>
            {content}
        </div>
    )
}

export default RouteConfig