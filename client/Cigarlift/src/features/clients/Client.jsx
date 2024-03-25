import { useGetClientByIdQuery, useGetClientImageQuery } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage, { NoImage } from './ClientImage'

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

    if (isError) content = <p>error</p>

    if (isSuccess) {
        console.log(client)
        const handleDirections = () => {
            window.open("https://www.google.com/maps/dir/?api=1&destination="+encodeURI(`${client.address} ${client.city} ${client.state}`))
        };

        content = 
            <div className='client'>
                
            <div className='client-header'>
                { client.images.locationImage?
                    <ClientImage src={client.images.locationImage} />
                    :
                    <NoImage />
                }
                <div className='client-name'>
                    <h1>{client.dba}</h1>
                    <h3>{client.taxpayer}</h3>
                </div>
            </div>
            <button onClick={handleDirections}>Get Directions</button>
            <table className='client-table'>
                <tbody>
                <tr>
                    <td className='label'><label>License: </label></td>
                    <td><p>{client.license}</p></td>
                </tr>

                <tr>
                    <td className='label'><label>Address: </label></td>
                    <td><p>{client.address}</p></td>
                </tr>
                
                <tr>
                    <td className='label'><label>City: </label></td>
                    <td><p>{client.city}</p></td>
                </tr>
                
                <tr>
                    <td className='label'><label>State: </label></td>
                    <td><p>{client.state}</p></td>
                </tr>

                <tr>
                    <td className='label'><label>Contact: </label></td>
                    <td><p>{client.contact}</p></td>
                </tr>
                
                <tr>
                    <td className='label'><label>Phone: </label></td>
                    <td><p>{client.phone}</p></td>
                </tr>
                
                <tr>
                    <td className='label'><label>Website: </label></td>
                    <td><p>{client.website}</p></td>
                </tr>
                
                <tr>
                    <td className='label'><label>Notes: </label></td>
                    <td><p>{client.notes}</p></td>
                </tr>
                
                <tr>
                    <td className='label'><label>Visited: </label></td>
                    <td><p>{client.isVisited}</p></td>
                </tr>
                </tbody>
            </table>
            <div className="images-header">
                <p>Contract</p>
                <p>License</p>
                <p>Humidor</p>
            </div>
            <div className='images'>
                { client.images.contractImage?
                    <ClientImage src={client.images.contractImage} />
                    :
                    <NoImage />
                }
                { client.images.licenseImage?
                    <ClientImage src={client.images.licenseImage} />
                    :
                    <NoImage />
                }
                { client.images.humidorImage?
                    <ClientImage src={client.images.humidorImage} />
                    :
                    <NoImage />
                }
            </div>
            </div>
    }

    return content
}

export default Client