import { useGetClientByIdQuery } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage from './ClientImage'

const Client = ({ id }) => {
    useTitle('Cigarlift: Client')
    
    //const { id } = useParams()

    const { data: client, 
        isLoading, 
        isError, 
        error, 
        isSuccess 
    } = useGetClientByIdQuery(id)

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) content =  <p>error</p>

    if (isSuccess) {
        console.log(client)
        const handleButtonClose = () => {
            close()
        }

        content = 
            <div className='client'>
                
            <div className='client-header'>
                <ClientImage src={client.images.locationImage} />
                <div className='client-name'>
                    <h1>{client.dba}</h1>
                    <h3>{client.taxpayer}</h3>
                </div>
            </div>
            <div className="client-body">
                <p>License: {client.license}</p>
                <p>Address: {client.address}</p>
                <p>City: {client.city}</p>
                <p>State: {client.state}</p>
                <p>Zip: {client.zip}</p>
                <p>Contact: {client.contact}</p>
                <p>Phone: {client.phone}</p>
                <p>Website: {client.website}</p>
                <p>Notes: {client.notes}</p>
                <p>Visited: {client.isVisited ? 'Yes' : 'No'}</p>
            </div>
                
                
            </div>
    }

    return content
}

export default Client