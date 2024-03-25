import { Fragment, useState } from 'react'
import LocationCard from '../../components/LocationCard'
import { useSelector, useDispatch } from 'react-redux'
import { useGetItineraryQuery, useUpdateItineraryMutation } from "./itineraryApiSlice"
//import User from './User'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

import { Tabs, Tab, Box } from '@mui/material/';
import Navbar from '../../components/Navbar'

function Drive() {
  useTitle('Cigarlift: Drive')

  const [currentTab, setCurrentTab] = useState(0)

  const [updateItinerary, {
    data,
    isLoading: isUpdateLoading,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError
}] = useUpdateItineraryMutation()

    const {
        data: itinerary,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetItineraryQuery("20240325", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const handleVisit = (locationID) => {
      console.log("visited " + locationID) 
      console.log(locationID) 
      updateItinerary({ id: "20240325", stopId: locationID })
    }

    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
      console.log("Error")
      console.log(error)
        content = <p className="errmsg">{error?.originalStatus}</p>
    }

    if (isSuccess) {

        const { stops } = itinerary
        const unvisited = stops.filter(stop => !stop.isVisited)
        const visited = stops.filter(stop => stop.isVisited)

        const handleTabChange = (e, tabIndex) => {
          setCurrentTab(tabIndex);
        };


        content = (
            <div className="itinerary">
              <h2>Itinerary</h2>
              
              <Tabs value={currentTab} onChange={handleTabChange} centered>
                <Tab label="Schedule" />
                <Tab label="Visited" />
              </Tabs>
              {currentTab === 0 && 
                <>
                  {unvisited.length === 0 ?
                      <p>All done for today...</p> 
                      :
                      unvisited.map((loc, index) => (
                        <Fragment key={index}>
                          <LocationCard location={loc} onVisit={handleVisit} key={index} />
                        </Fragment>
                      ))
                  }
                </>
              }
              {currentTab === 1 && 
                <>
                  {visited.length === 0 ?
                      <p>No stops yet...</p> 
                      :
                      visited.map((loc, index) => (
                        <LocationCard location={loc} onVisit={handleVisit} key={index} />
                      ))
                  }
                </>
              }
            </div>
        )
    }

    return content

}

export default Drive
