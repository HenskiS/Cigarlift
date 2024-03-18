import { useParams } from 'react-router-dom'
import EditClientForm from './EditClientForm'
import { useGetClientByIdQuery } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditClient = () => {
    useTitle('Cigarlift: Client')

    const { id } = useParams()
    console.log(id)

    const { data: client, isLoading, isError, error, isSuccess } = useGetClientByIdQuery(id)
    console.log(JSON.stringify(client))

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) content =  <p>error</p>

    if (isSuccess) {
        content = <h3>{client.dba}</h3>//<EditClientForm client={client} />
    }

    

    return content
}
export default EditClient