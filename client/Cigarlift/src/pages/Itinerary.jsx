import { useState } from 'react'
import LocationCard from '../components/LocationCard'
import img1 from '../assets/placeholderPics/img1.jpg'
import img2 from '../assets/placeholderPics/img2.jpg'
import img3 from '../assets/placeholderPics/img3.jpg'

import { Tabs, Tab } from '@mui/material/';

function Itinerary() {
  const [locations, setLocations] = useState([
    {
      "name": "Rixos The Palm Dubai",
      "address": "755 W Dune St",
      "position": [25.1212, 55.1535],
      "image": img1
    },
    {
      "name": "Shangri-La Hotel",
      "address": "62 Grumman Ln",
      "location": [25.2084, 55.2719],
      "image": img2
    },
    {
      "name": "Grand Hyatt",
      "address": "12 Birch Ave",
      "location": [25.2285, 55.3273],
      "image": img3
    }
  ])

  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (e, tabIndex) => {
    console.log(tabIndex);
    setCurrentTab(tabIndex);
  };


  return (
    <>
      <h4>Itinerary</h4>
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Schedule" />
        <Tab label="Visited" />
      </Tabs>
      {locations.map((loc) => (
        <LocationCard location={loc} />
      ))}
      
    </>
  )
} 

export default Itinerary
