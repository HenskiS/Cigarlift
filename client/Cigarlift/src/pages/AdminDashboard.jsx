import UsersList from "../features/users/UsersList"
import useTitle from "../hooks/useTitle"

function AdminDashboard() {
    useTitle('Cigarlift: Dashboard')

    return (
        <>
        <h1>Admin Dashboard</h1>
        <UsersList />
        </>
    )
}
export default AdminDashboard