import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import PrivateRoutes from './components/PrivateRoutes.jsx';
import Auth from './pages/Auth.jsx';
import Drive from './pages/Drive.jsx'
import Order from './pages/Order.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Missing from './pages/Missing.jsx';

const ROLES = {
  'User': 2001,
  //'Editor': 1984,
  'Admin': 5150
}

function App() {
  

  return (
    <Routes>
      {/* public routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/auth" element={<Auth />} />
      {/* private routes */}
      
      <Route element={<PrivateRoutes allowedRoles={[ROLES.Admin]} />} >
        <Route path="/" element={<AdminDashboard />} />
      </Route>
      <Route element={ <PrivateRoutes allowedRoles={[ROLES.User]} /> }>
        <Route path="drive" element={<Drive />} />
        <Route path="order" element={<Order />} />
        {/*<Route path="*" element={<Drive />} />*/}
      </Route>
      
      <Route path="*" element={<Missing />} />
      
    </Routes>
  )
}

export default App
