import { createSlice } from '@reduxjs/toolkit'
import img1 from '../assets/placeholderPics/img1.jpg'
import img2 from '../assets/placeholderPics/img2.jpg'
import img3 from '../assets/placeholderPics/img3.jpg'

export const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState: {
    unvisited: [{
        "_id": 0,
        "name": "Rixos The Palm",
        "address": "755 W Dune St",
        "position": [25.1212, 55.1535],
        "image": img1
      },
      {
        "_id": 1,
        "name": "Liquor Jr. Mart",
        "address": "62 Grumman Ln",
        "location": [25.2084, 55.2719],
        "image": img2
      },
      {
        "_id": 2,
        "name": "Party Time Liquor",
        "address": "12 Birch Ave",
        "location": [25.2285, 55.3273],
        "image": img3
      }],
    visited: []
  },
  reducers: {
    visit: (state, action) => {
        const locationIndex = state.unvisited.findIndex(loc => loc._id === action.payload);
        if (locationIndex !== -1) {
            console.log("visited: " + state.unvisited[locationIndex].name)
            const visitedLocation = state.unvisited[locationIndex]; // Copy visited location
            const updatedUnvisited = [...state.unvisited];          // Remove the location from unvisited
            updatedUnvisited.splice(locationIndex, 1);
            state.unvisited = updatedUnvisited;
            // Add the location to the visited array
            state.visited.push(visitedLocation);
        }
    },
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { visit, increment, decrement, incrementByAmount } = itinerarySlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = (state) => state.counter.value
export const selectVisited = (state) => state.itinerary.visited
export const selectUnvisited = (state) => state.itinerary.unvisited

export default itinerarySlice.reducer