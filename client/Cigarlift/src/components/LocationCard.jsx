import { useState } from 'react'
import './LocationCard.css'; // Import CSS file for styling
import { useGetItineraryImageQuery } from '../features/drive/itineraryApiSlice';

function LocationCard({ location, onVisit }) {
  const handleVisitClick = () => {
    onVisit(location._id);
  };

  const { data: imageData, error, isLoading, isSuccess } = useGetItineraryImageQuery(location.imageName);

  return (
    <div className="card">
      <div className="image-container">
        { isLoading ? <p>Loading...</p> :
        <img src={`data:image/jpeg;base64,${imageData}`} alt="Location" className="location-image" />
        }
        </div>
      <div className="details">
        <h3 className="name">{location.name}</h3>
        <p className="address">{location.address}</p>
      </div>
      { onVisit? <button onClick={handleVisitClick}>{location.isVisited? "Unvisit" : "Visit"}</button> : <></> }
    </div>
  )
} 

export default LocationCard
