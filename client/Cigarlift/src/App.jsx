import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Itinerary from './pages/Itinerary.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Itinerary />
      
    </>
  )
}

export default App
