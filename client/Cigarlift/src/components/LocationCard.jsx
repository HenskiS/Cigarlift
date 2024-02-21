import { useState } from 'react'
import './LocationCard.css'; // Import CSS file for styling

function LocationCard({ location }) {

  return (
    <div className="card">
      <div className="image-container">
        <img src={location.image} alt="Location" className="location-image" />
      </div>
      <div className="details">
        <h3 className="name">{location.name}</h3>
        <p className="address">{location.address}</p>
      </div>
    </div>
  )
} 

export default LocationCard
