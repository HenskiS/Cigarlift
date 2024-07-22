import { useState, useEffect } from 'react'
import ClientSelect from '../clients/ClientSelect';
import Route from './Route';
import { useGetClientByIdQuery } from '../clients/clientsApiSlice';

const RoutePlanner = () => {

    return (
        <div className='routeplanner'>

            <h2>Today's Route</h2>

            

            <Route />

        </div>
    )
}

export default RoutePlanner