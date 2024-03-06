import { Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './Navbar';
import useAuth from '../hooks/useAuth.jsx';

const PrivateRoutes = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log("Auth.roles: " + auth.roles)
    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <><Navbar /><Outlet /></> 
            : auth?.user
                ? <Navigate to="/drive" state={{ from: location }} replace />
                : <Navigate to="/auth" state={{ from: location }} replace />
    );
}
export default PrivateRoutes