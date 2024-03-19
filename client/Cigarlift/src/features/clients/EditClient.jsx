import { useParams } from 'react-router-dom'
import EditClientForm from './EditClientForm'
import { useGetClientByIdQuery } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditClient = ({ id }) => {
    useTitle('Cigarlift: Client')

    const { data: client, isLoading, isError, error, isSuccess } = useGetClientByIdQuery(id)
    console.log(JSON.stringify(client))

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) content =  <p>error</p>

    if (isSuccess) {
        content = <EditClientForm client={client} />
    }

    

    return content
}
export default EditClient