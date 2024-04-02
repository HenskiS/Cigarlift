import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const cigarsAdapter = createEntityAdapter({})

const initialState = cigarsAdapter.getInitialState()

export const cigarsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCigars: builder.query({
            query: () => ({
                url: '/cigars',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: { type: 'Cigar', id: 'LIST' },
        }),
        addNewCigar: builder.mutation({
            query: initialCigarData => ({
                url: '/cigars',
                method: 'POST',
                body: {
                    ...initialCigarData,
                }
            }),
            invalidatesTags: [
                { type: 'Cigar', id: 'LIST' }
            ]
        }),
        updateCigar: builder.mutation({
            query: initialCigarData => ({
                url: '/cigars',
                method: 'PATCH',
                body: {
                    ...initialCigarData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Cigar', id: arg._id }
            ]
        }),
        deleteCigar: builder.mutation({
            query: ({ id }) => ({
                url: `/cigars`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Cigar', id: arg._id }
            ]
        }),
    }),
})

export const {
    useGetCigarsQuery,
    useAddNewCigarMutation,
    useUpdateCigarMutation,
    useDeleteCigarMutation,
} = cigarsApiSlice

// returns the query result object
export const selectCigarsResult = cigarsApiSlice.endpoints.getCigars.select()

// creates memoized selector
const selectCigarsData = createSelector(
    selectCigarsResult,
    cigarsResult => cigarsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllCigars,
    selectById: selectCigarById,
    selectIds: selectCigarIds
    // Pass in a selector that returns the cigars slice of state
} = cigarsAdapter.getSelectors(state => selectCigarsData(state) ?? initialState)