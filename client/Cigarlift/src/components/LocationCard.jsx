import { memo, useState } from 'react'
import './LocationCard.css'; // Import CSS file for styling
import { useGetItineraryImageQuery } from '../features/drive/itineraryApiSlice';
import { useGetClientByIdQuery, useGetClientImageQuery } from '../features/clients/clientsApiSlice'
import { useNavigate } from 'react-router-dom';
import ClientImage from '../features/clients/ClientImage';
import PulseLoader from 'react-spinners/PulseLoader'

const LocationCard = memo(function LocationCard({ location, onVisit }) {
    const navigate = useNavigate()
    const handleVisitClick = () => {
        onVisit(location._id);
    };
    const handleDirections = () => {
        window.open("https://www.google.com/maps/dir/?api=1&destination="+encodeURI(`${location.address} ${location.city} ${location.state}`))
    };

    //const { data: imageData, error, isLoading, isSuccess } = useGetClientImageQuery(location.images.locationImage);
    const { data: client, 
        isLoading, 
        isError, 
        error, 
        isSuccess 
    } = useGetClientByIdQuery(location._id)
    const handleClick = () => {
        navigate(`/clients/${location._id}`)
    }
    
    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) content = <p>error</p>

    if (isSuccess) {

        content = (
          <div className="card">
            <ClientImage src={client.images.locationImage} />
            <div className="details" onClick={handleClick}>
              <h3 className="name">{client.dba}</h3>
              <p className="address">{client.address}</p>
            </div>
            <div className="location-buttons">
              { onVisit? 
                <button className='visit' variant='outlined' onClick={handleVisitClick}>{client.isVisited? "Unvisit" : "Visit"}</button> 
                : <></> }
              <button className='directions' variant='outlined' onClick={handleDirections}>Directions</button>
            </div>
            
          </div>
      )
    }
    return content
} )

export default LocationCard
