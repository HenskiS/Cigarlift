import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const itineraryAdapter = createEntityAdapter({})

const initialState = itineraryAdapter.getInitialState()

export const itineraryApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getItinerary: builder.query({
            query: ( date ) => ({
                url: "/itineraries/getByDate",//`/itineraries/${date}`,
                method: 'POST',
                body: { date },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: ['Itinerary']
        }),
        addNewItinerary: builder.mutation({
            query: initialItineraryData => ({
                url: '/itineraries',
                method: 'POST',
                body: {
                    ...initialItineraryData,
                }
            }),
            invalidatesTags: ['Itinerary']
        }),
        updateItinerary: builder.mutation({
            query: (id, stopId) => ({
                url: '/itineraries',
                method: 'PATCH',
                body: { id, stopId }
            }),
            invalidatesTags: ['Itinerary']
        }),
        deleteItinerary: builder.mutation({
            query: ({ id }) => ({
                url: `/itineraries`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => ['Itinerary']
        }),
        getItineraryImage: builder.query({
            query: ( imageName ) => ({
                url: `/images/${imageName}`,
                method: 'GET',
                responseHandler: (response) => response.text(),
            }),
            async onQueryStarted(queryArg, { dispatch, getState, extra, requestId }) {
                console.log('Fetching image:', `/itineraries/images/${queryArg}`);
            }
        }),
    }),
})

export const {
    useGetItineraryQuery,
    useAddNewItineraryMutation,
    useUpdateItineraryMutation,
    useDeleteItineraryMutation,
    useGetItineraryImageQuery,
} = itineraryApiSlice

// returns the query result object
export const selectItineraryResult = itineraryApiSlice.endpoints.getItinerary.select()

// creates memoized selector
const selectItineraryData = createSelector(
    selectItineraryResult,
    itineraryResult => itineraryResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllItinerary,
    selectById: selectItineraryById,
    selectIds: selectItineraryIds
    // Pass in a selector that returns the itinerary slice of state
} = itineraryAdapter.getSelectors(state => selectItineraryData(state) ?? initialState)