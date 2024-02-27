import { configureStore } from '@reduxjs/toolkit'
import itineraryReducer from './components/itinerarySlice';

export default configureStore({
  reducer: {
    itinerary: itineraryReducer
  }
})