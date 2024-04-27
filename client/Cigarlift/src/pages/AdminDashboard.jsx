import EmailSelect from "../components/EmailSelect"
import Inventory from "../features/cigars/Inventory"
import RouteConfig from "../features/drive/RouteConfig"
import UsersList from "../features/users/UsersList"
import useTitle from "../hooks/useTitle"

function AdminDashboard() {
    useTitle('Cigarlift: Dashboard')

    return (
        <>
        <h1>Admin Dashboard</h1>
        <UsersList />
        <RouteConfig />
        <EmailSelect />
        <Inventory />
        </>
    )
}
export default AdminDashboard