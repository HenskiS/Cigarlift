import EmailSelect from "../components/EmailSelect"
import Inventory from "../features/cigars/Inventory"
import RouteConfig from "../features/drive/RouteConfig"
import RoutePlanner from "../features/drive/RoutePlanner"
import Reports from "../features/reports/Reports"
import UsersList from "../features/users/UsersList"
import useTitle from "../hooks/useTitle"

function AdminDashboard() {
    useTitle('Cigarlift: Dashboard')

    return (
        <>
        <h1>Admin Dashboard</h1>
        <Inventory />
        <UsersList />
        {/* <RouteConfig /> */}
        <EmailSelect />
        {/* <RoutePlanner /> */}
        {/* <Inventory /> */}
        <Reports />
        </>
    )
}
export default AdminDashboard