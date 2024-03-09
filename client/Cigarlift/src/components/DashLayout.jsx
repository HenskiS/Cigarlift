import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
//import DashHeader from './DashHeader'
//import DashFooter from './DashFooter'

const DashLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
    /*return (
        <>
            <DashHeader />
            <div className="dash-container">
                <Outlet />
            </div>
            <DashFooter />
        </>
    )*/
}
export default DashLayout