import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Drive from './pages/Drive.jsx'
import Navbar from './components/Navbar.jsx';
import PrivateRoutes from './components/PrivateRoutes.jsx';
import Auth from './pages/Auth.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Order from './pages/Order.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<PrivateRoutes />}>
        <Route path="/" element={<Navbar />}>
          {/*<Route index element={<AdminRoute />} />*/}
          <Route index element={<AdminRoute />} />
          <Route path="drive" element={<Drive />} />
          <Route path="order" element={<Order />} />
          {/*
          <Route path="photos" element={<Photos />} />
          <Route path="reppersonal" element={<RepPersonal />} />
          <Route path="clientlist" element={<ClientList />} />
          */}

          <Route path="*" element={<Drive />} />
        </Route>
      </Route>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App
