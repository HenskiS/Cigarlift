import { useGetClientByIdQuery, useGetClientImageQuery } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage, { NoImage } from './ClientImage'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useState } from 'react'
import EditClientForm from './EditClientForm'
import { setClient } from '../order/orderSlice'
import { useDispatch } from 'react-redux'

const Client = ({ cid, close }) => {
    useTitle('Cigarlift: Client')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    let id // id is set by param if it exists, or prop if it does not

    const {id: paramId} = useParams()
    
    if (paramId) {
        id = paramId
    } else id = cid

    const [clientSelected, setClientSelected] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false);

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
        const handleButtonClose = () => {
            close()
        }
        const handleButtonEdit  = () => setIsClientEdit(!isClientEdit)
        const handleNavigateToDrive = () => navigate('/drive')
        const handleStartOrder = () => {
            dispatch(setClient(client))
            navigate('/order')
        }
        const handleSchedule = () => {
            dispatch(setClient(client))
            navigate('/appointments')
        }

        content = 
            <>
                <div className="client-button-header">
                    <button className="client-button" 
                        onClick={close ? handleButtonClose : handleNavigateToDrive}>
                            <ArrowBackIosIcon /> Back</button>
                    <button className="client-button" onClick={handleButtonEdit}>{isClientEdit? "Cancel":"Edit"}</button>
                </div>
                {isClientEdit? <EditClientForm client={client} close={handleButtonEdit} /> : 
                <div hidden={isClientEdit} className='client'>
                    
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
                    <div className='client-header-buttons'>
                        <button className='b1' onClick={handleDirections}>Get Directions</button>
                        <button className='b2' onClick={handleStartOrder}>Start Order</button>
                        <button className='b3' onClick={handleSchedule}>Schedule Appointment</button>
                    </div>
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
                            <td><p>{client.isVisited? "Yes" : "No"}</p></td>
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
                </div>}
            </>
    }

    return content
}

export default Client