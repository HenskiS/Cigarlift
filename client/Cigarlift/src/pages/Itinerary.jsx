import { Fragment, useState } from 'react'
import LocationCard from '../components/LocationCard'
import img1 from '../assets/placeholderPics/img1.jpg'
import img2 from '../assets/placeholderPics/img2.jpg'
import img3 from '../assets/placeholderPics/img3.jpg'

import { Tabs, Tab, Box } from '@mui/material/';

function Itinerary() {
  const [unvisited, setUnvisited] = useState([
    {
      "_id": 0,
      "name": "Rixos The Palm",
      "address": "755 W Dune St",
      "position": [25.1212, 55.1535],
      "image": img1
    },
    {
      "_id": 1,
      "name": "Liquor Jr. Mart",
      "address": "62 Grumman Ln",
      "location": [25.2084, 55.2719],
      "image": img2
    },
    {
      "_id": 2,
      "name": "Party Time Liquor",
      "address": "12 Birch Ave",
      "location": [25.2285, 55.3273],
      "image": img3
    }
  ])
  const [visited, setVisited] = useState([])

  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (e, tabIndex) => {
    console.log(tabIndex);
    setCurrentTab(tabIndex);
  };

  const handleVisit = (locationId) => {
    const locationIndex = unvisited.findIndex(loc => loc._id === locationId);
    if (locationIndex !== -1) {
      console.log("visited: " + unvisited[locationIndex].name)
      const visitedLocation = unvisited[locationIndex]; // Copy visited location
      const updatedUnvisited = [...unvisited];          // Remove the location from unvisited
      updatedUnvisited.splice(locationIndex, 1);
      setUnvisited(updatedUnvisited);
      // Add the location to the visited array
      setVisited(prevVisitedLocations => [...prevVisitedLocations, visitedLocation]);
      console.log(visited)
    }

  }

  const UnvisitedList = () => {
    return (
    unvisited.length === 0 ?
        <p>All done for today...</p> 
        :
        unvisited.map((loc, index) => (
          <LocationCard location={loc} onVisit={handleVisit} key={index} />
        ))
    )
  }
  const VisitedList = () => {
    return (
    visited.length === 0 ?
        <p>No stops yet...</p> 
        :
        visited.map((loc, index) => (
          <LocationCard location={loc} key={index} />
        ))
    )
  }

  return (
    <>
      <h4>Itinerary</h4>
      <Tabs value={currentTab} onChange={handleTabChange} centered>
        <Tab label="Schedule" />
        <Tab label="Visited" />
      </Tabs>
      {currentTab === 0 && <UnvisitedList />}
      {currentTab === 1 && <VisitedList />}
      
    </>
  )
} 

export default Itinerary
