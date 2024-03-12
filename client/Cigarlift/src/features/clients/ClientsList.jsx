import { useGetClientsQuery } from "./clientsApiSlice"
import Client from './Client'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

const ClientsList = () => {
    useTitle('Cigarlift: Clients List')

    const {
        data: clients,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetClientsQuery('clientsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = clients

        const tableContent = ids?.length && ids.map(clientId => <Client key={clientId} clientId={clientId} />)

        content = (
            <>
                <h2>Clients List</h2>
                <table className="table table--clients">
                    <thead className="table__thead">
                        <tr>
                            <th scope="col" className="table__th client__clientname">Clientname</th>
                            <th scope="col" className="table__th client__roles">Roles</th>
                            <th scope="col" className="table__th client__edit">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </>
        )
    }

    return content
}
export default ClientsList