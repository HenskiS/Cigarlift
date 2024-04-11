import { createSlice } from '@reduxjs/toolkit'

const orderSlice = createSlice({
    name: 'order',
    initialState: { cart: [] },
    reducers: {
        removeCigar: (state, action) => {
            const newCart = state.cart.filter(cigar => cigar._id !== action.payload)
            state.cart = newCart
        },
        addCigar: (state, action) => {
            state.cart.push(action.payload)
        },
        updateQuantity: (state, action) => {
            console.log(action.payload)
            const newQuantity = action.payload.qty
            const cigar = action.payload.cigar
            if (newQuantity === "" || newQuantity === 0 || !newQuantity || !parseInt(newQuantity)) {
                const newCart = state.cart.filter(oldCigar => oldCigar._id !== cigar._id)
                state.cart = newCart
            }
            else {
                if (state.cart.find(oldCigar => oldCigar._id === cigar._id)) {
                    const updatedCigars = state.cart.map(oldCigar =>
                        oldCigar._id === cigar._id ? { ...cigar, qty: parseInt(newQuantity) } : oldCigar
                    )
                    state.cart = updatedCigars
                }
                else state.cart.push({ ...cigar, qty: parseInt(newQuantity) })
            }
        }
    }
})

export const { removeCigar, addCigar, updateQuantity } = orderSlice.actions

export default orderSlice.reducer

export const selectCart = (state) => state.order.cart