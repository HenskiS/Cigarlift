import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const clientsAdapter = createEntityAdapter({})

const initialState = clientsAdapter.getInitialState()

export const clientsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getClients: builder.query({
            query: () => ({
                url: '/clients',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            /*transformResponse: responseData => {
                const loadedClients = responseData.map(client => {
                    client.id = client._id
                    return client
                });
                return clientsAdapter.setAll(initialState, loadedClients)
            },*/
            providesTags: { type: 'Client', id: 'LIST' },
        }),
        getCities: builder.query({
            query: () => ({
                url: '/clients/cities',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: { type: 'City', id: 'LIST' },
        }),
        getClientById: builder.query({
            query: (id) => ({
                url: `/clients/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            providesTags: ['Client'],
        }),
        addNewClient: builder.mutation({
            query: initialClientData => ({
                url: '/clients',
                method: 'POST',
                body: {
                    ...initialClientData,
                }
            }),
            invalidatesTags: [
                { type: 'Client', id: "LIST" }
            ]
        }),
        updateClient: builder.mutation({
            query: initialClientData => ({
                url: '/clients',
                method: 'PATCH',
                body: {
                    ...initialClientData,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                'Client'//{ type: 'Client', id: arg.id }
            ]
        }),
        updateNotes: builder.mutation({
            query: ({ id, newNotes, updatedBy }) => ({
                url: `/clients/update-notes/${id}`,
                method: 'PATCH',
                body: {
                    newNotes, updatedBy
                }
            }),
            invalidatesTags: (result, error, arg) => [
                'Client'//{ type: 'Client', id: arg.id }
            ]
        }),
        deleteClient: builder.mutation({
            query: ({ id }) => ({
                url: `/clients`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Client', id: arg.id }
            ]
        }),
        getClientImage: builder.query({
            query: (imageName) => ({
                url: `/images/${imageName}`,
                method: 'GET',
                responseHandler: (response) => response.text(),
            }),
            providesTags: (result, error, imageName) => [
                { type: 'ClientImage', id: imageName }
            ],
            async onQueryStarted(queryArg) {
                console.log('Fetching image:', `/images/${queryArg}`);
            }
        }),
        uploadClientImage: builder.mutation({
            query: (formData) => ({
                url: `/images/`,
                method: 'POST',
                body: formData
            }),
            async onQueryStarted(queryArg) {
                console.log('Posting image');
            },
            invalidatesTags: (result, error, formData) => [
                'Client',
                { type: 'ClientImage', id: formData.get('file').name }
            ]
        }),
        deleteClientImage: builder.mutation({
            query: (imageName) => ({
                url: `/images/${imageName}`,
                method: 'DELETE'
            }),
            async onQueryStarted(queryArg) {
                console.log('Deleting image:', queryArg);
            },
            invalidatesTags: (result, error, imageName) => [
                'Client',
                { type: 'ClientImage', id: imageName }
            ]
        }),
    }),
})

export const {
    useGetClientsQuery,
    useGetCitiesQuery,
    useGetClientByIdQuery,
    useAddNewClientMutation,
    useUpdateClientMutation,
    useUpdateNotesMutation,
    useDeleteClientMutation,
    useGetClientImageQuery,
    useUploadClientImageMutation,
    useDeleteClientImageMutation,
} = clientsApiSlice

// returns the query result object
export const selectClientsResult = clientsApiSlice.endpoints.getClients.select()

// creates memoized selector
const selectClientsData = createSelector(
    selectClientsResult,
    clientsResult => clientsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllClients,
    selectById: selectClientById,
    selectIds: selectClientIds
    // Pass in a selector that returns the clients slice of state
} = clientsAdapter.getSelectors(state => selectClientsData(state) ?? initialState)