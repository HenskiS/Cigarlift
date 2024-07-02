import { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAddStopsMutation, useGetItineraryQuery, useUpdateItineraryMutation } from "./itineraryApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import dayjs from 'dayjs'

import { Tabs, Tab, Box } from '@mui/material/';
import ClientSelect from '../clients/ClientSelect'


function Route() {

    const date = dayjs().tz('America/Los_Angeles');
    const today = date.format('YYYYMMDD');
    console.log(today)

    const [currentTab, setCurrentTab] = useState(0)
    const [clientSelected, setClientSelected] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false);
    const [isClientSelect, setIsClientSelect] = useState(false)
    const [selection, setSelection] = useState([])
    

    const [updateItinerary, {
        data,
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateItineraryMutation()

    const [addStops] = useAddStopsMutation()

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

    useEffect(()=>{
        async function addClients() {
            await addStops({id: itinerary._id, stops: selection})
            setSelection([])
        }
        if (selection?.length) {
            addClients()
        }
    }, [addStops, itinerary?._id, selection])

    let content

    if (isLoading) content = <PulseLoader color={"#CCC"} />
    if (isError) content = <p className="errmsg">{error?.originalStatus}</p>

    if (isSuccess) {

        const { stops } = itinerary
        const unvisited = stops.filter(stop => !stop.isVisited)
        const visited = stops.filter(stop => stop.isVisited)

        const handleTabChange = (e, tabIndex) => {
          setCurrentTab(tabIndex);
        };

        content = (
  
            <div className="">

                <button onClick={() => setIsClientSelect(true)}>Add Client(s)</button>
                {isClientSelect? <ClientSelect close={()=>setIsClientSelect(false)} setSelection={setSelection} /> : null}
                
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
                            <div className="route-stop" key={index}>
                                <p>{loc.dba}</p>
                                <p style={{color: "grey"}}>{loc.address}</p>
                            </div>
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
                            <div className="route-stop" key={index}>
                                <p>{loc.dba}</p>
                            </div>
                        ))
                    }
                  </>
                }
          
            </div>
        )
    }

    return content

}

export default Route
