import { Navigate, Outlet } from 'react-router-dom'
const PrivateRoutes = () => {
    const tokenString = sessionStorage.getItem('token');
    const token = true //(tokenString !== 'undefined') ? tokenString : null;
    console.log("private routes")
    return (
        token ? <Outlet /> : <Navigate to='/auth'/>
    )
}
export default PrivateRoutes