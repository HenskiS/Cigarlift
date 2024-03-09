import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const stopsAdapter = createEntityAdapter({})

const initialState = stopsAdapter.getInitialState()

export const stopsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getStops: builder.query({
            query: () => ({
                url: '/stops',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedStops = responseData.map(stop => {
                    stop.id = stop._id
                    return stop
                });
                return stopsAdapter.setAll(initialState, loadedStops)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Stop', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Stop', id }))
                    ]
                } else return [{ type: 'Stop', id: 'LIST' }]
            }
        }),
        addNewStop: builder.mutation({
            query: initialStopData => ({
                url: '/stops',
                method: 'POST',
                body: {
                    ...initialStopData,
                }
            }),
            invalidatesTags: [
                { type: 'Stop', id: "LIST" }
            ]
        }),
        updateStop: builder.mutation({
            query: initialStopData => ({
                url: '/stops',
                method: 'PATCH',
                body: {
                    ...initialStopData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Stop', id: arg.id }
            ]
        }),
        deleteStop: builder.mutation({
            query: ({ id }) => ({
                url: `/stops`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Stop', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetStopsQuery,
    useAddNewStopMutation,
    useUpdateStopMutation,
    useDeleteStopMutation,
} = stopsApiSlice

// returns the query result object
export const selectStopsResult = stopsApiSlice.endpoints.getStops.select()

// creates memoized selector
const selectStopsData = createSelector(
    selectStopsResult,
    stopsResult => stopsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStops,
    selectById: selectStopById,
    selectIds: selectStopIds
    // Pass in a selector that returns the stops slice of state
} = stopsAdapter.getSelectors(state => selectStopsData(state) ?? initialState)