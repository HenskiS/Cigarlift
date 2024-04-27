import { Fragment, useState } from 'react'
import LocationCard from '../../components/LocationCard'
import { useSelector, useDispatch } from 'react-redux'
import { useGetItineraryQuery, useUpdateItineraryMutation } from "./itineraryApiSlice"
//import User from './User'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'
import dayjs from 'dayjs'

import { Tabs, Tab, Box } from '@mui/material/';
import Navbar from '../../components/Navbar'
import Client from '../clients/Client'
import EditClient from '../clients/EditClient'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useUpdateClientMutation } from '../clients/clientsApiSlice'


function Drive() {

    useTitle('Cigarlift: Drive')

    const date = dayjs().tz('America/Los_Angeles');
    const today = date.format('YYYYMMDD');
    console.log(today)

    const [currentTab, setCurrentTab] = useState(0)
    const [clientSelected, setClientSelected] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false);

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
    } = useGetItineraryQuery(today, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const handleVisit = async (locationID) => {
        console.log("visited " + locationID) 
        console.log(locationID) 
        await updateItinerary({ id: today, stopId: locationID })
    }

    let content

    if (isLoading) content = <PulseLoader color={"#CCC"} />

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
        const handleClick = (id) => {
          setClientSelected(id)
        }
        const handleButtonClose = () => {
            setClientSelected(false)
            setIsClientEdit(false)
        }
        const handleButtonEdit  = () => setIsClientEdit(!isClientEdit)


        content = (
  
              <div className="itinerary" hidden={clientSelected}>
                <h1>Itinerary</h1>
                
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
                        <p>No stops visited yet...</p> 
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
