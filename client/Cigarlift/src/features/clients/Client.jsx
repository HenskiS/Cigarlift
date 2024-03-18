import { useParams } from 'react-router-dom'
//import EditClientForm from './EditClientForm'
import { useGetClientByIdQuery } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import { useGetItineraryImageQuery } from '../drive/itineraryApiSlice'
import './Client.css'
import ClientImage from './ClientImage'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Client = ({ id, close }) => {
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
            {close?
            <div className="client-button-header">
            <button className="client-button" onClick={handleButtonClose}><ArrowBackIosIcon /> Contacts</button>
            <button className="client-button">Edit</button>
            </div>
            : null}
            <div className='client-header'>
                <ClientImage src={client.images.locationImage} />
                <div className='client-name'>
                    <h1>{client.dba}</h1>
                    <h3>{client.taxpayer}</h3>
                </div>
            </div>
            <div className="client-body">
                <p>License: {client.license}</p>
                <p>Address: {client.address}, {client.city}, {client.state} {client.zip}</p>

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