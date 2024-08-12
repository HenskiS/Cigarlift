import React, { useEffect, useState } from 'react';
import { useAddStopsMutation, useGetItineraryQuery, useRegenerateItineraryMutation, useReOptimizeItineraryMutation, useUpdateItineraryMutation } from './itineraryApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import dayjs from 'dayjs';
import { Tabs, Tab } from '@mui/material/';
import ClientSelect from '../clients/ClientSelect';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Route() {
  const date = dayjs().tz('America/Los_Angeles');
  const today = date.format('YYYYMMDD');
  console.log(today);

  const [currentTab, setCurrentTab] = useState(0);
  const [isClientSelect, setIsClientSelect] = useState(false);
  const [selection, setSelection] = useState([]);

  const [updateItinerary, { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateItineraryMutation();
  const [addStops] = useAddStopsMutation();
  const [regenerateItinerary] = useRegenerateItineraryMutation();
  const [reOptimizeItinerary] = useReOptimizeItineraryMutation();

  const { data: itinerary, isLoading, isSuccess, isError, error } = useGetItineraryQuery(today, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    async function addClients() {
      await addStops({ id: itinerary._id, stops: selection });
      setSelection([]);
    }
    if (selection?.length) {
      addClients();
    }
  }, [addStops, itinerary?._id, selection]);

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedStops = Array.from(itinerary.stops);
    const [movedStop] = reorderedStops.splice(result.source.index, 1);
    reorderedStops.splice(result.destination.index, 0, movedStop);

    const updatedItinerary = { ...itinerary, stops: reorderedStops };
    await updateItinerary(updatedItinerary);
  };

  const handleTabChange = (e, tabIndex) => {
    setCurrentTab(tabIndex);
  };

  const handleRegenerateItinerary = async () => {
    if (itinerary) {
      await regenerateItinerary(itinerary);
    }
  };
  const handleReOptimizeItinerary = async () => {
    if (itinerary) {
      await reOptimizeItinerary(itinerary);
    }
  };

  let content;

  if (isLoading) content = <PulseLoader color={'#CCC'} />;
  if (isError) content = <p className="errmsg">{error?.originalStatus}</p>;

  if (isSuccess) {
    const { stops } = itinerary;

    content = (
      <div className="">
        <button style={{ marginBottom: '5px' }} onClick={() => setIsClientSelect(true)}>Add Stop(s)</button>
        <button style={{ marginBottom: '5px', marginLeft: '10px' }} onClick={handleRegenerateItinerary}>Regenerate Itinerary</button>
        <button style={{ marginBottom: '5px', marginLeft: '10px' }} onClick={handleReOptimizeItinerary}>Re-optimize Route</button>
        {isClientSelect ? <ClientSelect close={() => setIsClientSelect(false)} setSelection={setSelection} /> : null}

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="stops">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {stops.length === 0 ? (
                  <p>No stops yet...</p>
                ) : (
                  stops.map((loc, index) => (
                    <Draggable key={loc._id} draggableId={loc._id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={loc.isVisited ? 'route-stop-visited' : 'route-stop'}
                          style={{
                            ...provided.draggableProps.style,
                            margin: '8px 0',
                            padding: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                          }}
                        >
                          <p>{loc.dba}</p>
                          <p style={{ color: 'grey' }}>{loc.address}</p>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }

  return content;
}

export default Route;
