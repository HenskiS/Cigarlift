import { Navigate } from 'react-router-dom'
//import AdminDashboard from '../pages/AdminDashboard'

function AdminRoute() {
    const tokenString = sessionStorage.getItem('UserInfo');
    let user = (tokenString !== 'undefined') ? JSON.parse(tokenString) : null;
    let admin = false
    if (user) {
        console.log("User -v-")
        console.log
        admin = (user.roles.includes("Admin"))
    }
    /*console.log("admin: " + admin)*/
    
    /*return (
        admin ? <AdminDashboard /> : <Navigate to='/drive'/>
    )*/

    return (
        admin ? <h1>Admin Dashboard</h1> : <Navigate to='/drive'/>
    )
}
export default AdminRoute