import { createSlice } from '@reduxjs/toolkit'

const clientsSlice = createSlice({
    name: 'clients',
    initialState: { page: 1 },
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload
        },
    }
})

export const { setPage } = clientsSlice.actions

export default clientsSlice.reducer

export const selectCurrentPage = (state) => state.clients.page