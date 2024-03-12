import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetClientsQuery } from './clientsApiSlice'
import { memo } from 'react'

const Client = ({ clientId }) => {

    const { client } = useGetClientsQuery("clientsList", {
        selectFromResult: ({ data }) => ({
            client: data?.entities[clientId]
        }),
    })

    const navigate = useNavigate()

    if (client) {
        const handleEdit = () => navigate(`/clients/${clientId}`)

        const clientRolesString = client.roles.toString().replaceAll(',', ', ')

        const cellStatus = client.active ? '' : 'table__cell--inactive'

        return (
            <tr className="table__row client">
                <td className={`table__cell ${cellStatus}`}>{client.clientname}</td>
                <td className={`table__cell ${cellStatus}`}>{clientRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}

const memoizedClient = memo(Client)

export default memoizedClient