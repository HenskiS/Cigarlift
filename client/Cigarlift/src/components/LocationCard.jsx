import { useState } from 'react'
import './LocationCard.css'; // Import CSS file for styling
import { useGetItineraryImageQuery } from '../features/drive/itineraryApiSlice';
import { useGetClientImageQuery } from '../features/clients/clientsApiSlice'
function LocationCard({ location, onVisit }) {
  const handleVisitClick = () => {
    onVisit(location._id);
  };
  const handleDirections = () => {
    window.open("https://www.google.com/maps/dir/?api=1&destination="+encodeURI(`${location.address} ${location.city} ${location.state}`))
  };
  //console.log(location)

  const { data: imageData, error, isLoading, isSuccess } = useGetClientImageQuery(location.images.locationImage);
  
  return (
    <div className="card">
      <div className="image-container">
        { isLoading ? <p>Loading...</p> :
        <img src={`data:image/jpeg;base64,${imageData}`} alt="Location" className="location-image" />
        }
        </div>
      <div className="details">
        <h3 className="name">{location.dba}</h3>
        <p className="address">{location.address}</p>
      </div>
      <div className="location-buttons">
        { onVisit? 
          <button className='visit' variant='outlined' onClick={handleVisitClick}>{location.isVisited? "Unvisit" : "Visit"}</button> 
          : <></> }
        <button className='directions' variant='outlined' onClick={handleDirections}>Directions</button>
      </div>
      
    </div>
  )
} 

export default LocationCard
