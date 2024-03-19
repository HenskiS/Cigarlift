import { useUpdateClientMutation } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage from './ClientImage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EditClientForm = ({ client }) => {
    useTitle('Cigarlift: Client')

    const [updateClient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateClientMutation()

    const navigate = useNavigate()

    const [address, setAddress] = useState(client.address)
    const [city, setCity] = useState(client.city)
    const [state, setState] = useState(client.state)
    const [contact, setContact] = useState(client.contact)
    const [phone, setPhone] = useState(client.phone)
    const [website, setWebsite] = useState(client.website)
    const [notes, setNotes] = useState(client.notes)
    const [isVisited, setIsVisited] = useState(client.isVisited)
    
    useEffect(() => {
        console.log(isSuccess)
        if ( isSuccess ) {
            //setClientname('')
            //setPassword('')
            //setRoles([])
            navigate('/clients')
            window.location.reload()
        }

    }, [isSuccess, navigate])

    address, city, state, contact, phone, website, notes, isVisited
    const onSaveClientClicked = async (e) => {
        await updateClient({ 
            id: client._id, 
            license: client.license, 
            dba: client.dba, 
            taxpayer: client.taxpayer, 
            address, city, state, 
            contact, phone, website, 
            notes, isVisited })
    }

    const onAddressChanged = e => setAddress(e.target.value)
    const onCityChanged = e => setCity(e.target.value)
    const onStateChanged = e => setState(e.target.value)
    const onContactChanged = e => setContact(e.target.value)
    const onPhoneChanged = e => setPhone(e.target.value)
    const onWebsiteChanged = e => setWebsite(e.target.value)
    const onNotesChanged = e => setNotes(e.target.value)
    const onIsVisitedChanged = e => setIsVisited(!isVisited)

    let content

    content = 
        <div className='client'>
        <form className="form" onSubmit={e => e.preventDefault()}>
            <div className='client-header'>
                <ClientImage src={client.images.locationImage} />
                <div className='client-name'>
                    <h1>{client.dba}</h1>
                    <h3>{client.taxpayer}</h3>
                </div>
            </div>
            <table className='client-table'>
                <tbody>
                <tr>
                    <td className='label'><label>License: </label></td>
                    <td><p>{client.license}</p></td>
                </tr>

                <tr>
                    <td className='label'><label htmlFor='address'>Address: </label></td>
                    <td><input id='address' value={address} onChange={onAddressChanged} /></td>
                </tr>
                
                <tr>
                    <td className='label'><label htmlFor='city'>City: </label></td>
                    <td><input id='city' value={city} onChange={onCityChanged} /></td>
                </tr>
                
                <tr>
                    <td className='label'><label htmlFor='state'>State: </label></td>
                    <td><input id='state' value={state} onChange={onStateChanged} /></td>
                </tr>

                <tr>
                    <td className='label'><label htmlFor='contact'>Contact: </label></td>
                    <td><input id='contact' value={contact} onChange={onContactChanged} /></td>
                </tr>
                
                <tr>
                    <td className='label'><label htmlFor='phone'>Phone: </label></td>
                    <td><input id='phone' value={phone} onChange={onPhoneChanged} /></td>
                </tr>
                
                <tr>
                    <td className='label'><label htmlFor='website'>Website: </label></td>
                    <td><input id='website' value={website} onChange={onWebsiteChanged} /></td>
                </tr>
                
                <tr>
                    <td className='label'><label htmlFor='notes'>Notes: </label></td>
                    <td><textarea rows={3} id='notes' value={notes} onChange={onNotesChanged} /></td>
                </tr>
                
                <tr>
                    <td className='label'><label htmlFor='isVisited'>Visited: </label></td>
                    <td><input type='checkbox' id='isVisited' value={isVisited} onChange={onIsVisitedChanged} /></td>
                </tr>
                </tbody>
            </table>
            <button style={{marginBottom: '10px'}} className='client-button' onClick={onSaveClientClicked}>Save</button>
        </form>
            
        </div>

    return content
}

export default EditClientForm