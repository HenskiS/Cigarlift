import { Navigate, Outlet, Routes, Route } from 'react-router-dom'
import Drive from '../pages/Drive.jsx'
import Order from '../pages/Order.jsx';
import AdminRoute from './AdminRoute.jsx';
import Navbar from './Navbar';

const PrivateRoutes = () => {
    const tokenString = sessionStorage.getItem('token');
    const token = true //(tokenString !== 'undefined') ? tokenString : null;
    console.log("private routes")
    /*
    return (
        token ? <Outlet /> : <Navigate to='/auth'/>
    )
    */
   if (!token) return (<Navigate to='/auth'/>)

   return (
    <>
        <Navbar />
        <Routes>
            <Route index element={<AdminRoute />} />
          <Route path="drive" element={<Drive />} />
          <Route path="order" element={<Order />} />
          <Route path="*" element={<Drive />} />
        </Routes>
    </>
   )
}
export default PrivateRoutes