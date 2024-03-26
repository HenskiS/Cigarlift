import { useState } from 'react'
import './LocationCard.css'; // Import CSS file for styling
import { useGetItineraryImageQuery } from '../features/drive/itineraryApiSlice';
import { useGetClientImageQuery } from '../features/clients/clientsApiSlice'
import { useNavigate } from 'react-router-dom';

function LocationCard({ location, onVisit }) {
  const navigate = useNavigate()
  const handleVisitClick = () => {
    onVisit(location._id);
  };
  const handleDirections = () => {
    window.open("https://www.google.com/maps/dir/?api=1&destination="+encodeURI(`${location.address} ${location.city} ${location.state}`))
  };
  //console.log(location)

  const { data: imageData, error, isLoading, isSuccess } = useGetClientImageQuery(location.images.locationImage);
  const handleClick = () => {
    navigate(`/clients/${location._id}`)
  }

  return (
    <div className="card">
      <div className="image-container" onClick={handleClick}>
        { isLoading ? <p>Loading...</p> :
        <img src={`data:image/jpeg;base64,${imageData}`} alt="Location" className="location-image" />
        }
        </div>
      <div className="details" onClick={handleClick}>
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
