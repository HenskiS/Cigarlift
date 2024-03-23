import { useUpdateClientMutation, useUploadClientImageMutation } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage, { NoImage } from './ClientImage'
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
    const [uploadImage, {
        isLoading: imgisLoading,
        isSuccess: imgisSuccess,
        isError: imgisError,
        error: imgerror
    }] = useUploadClientImageMutation()

    const navigate = useNavigate()

    const [address, setAddress] = useState(client.address)
    const [city, setCity] = useState(client.city)
    const [state, setState] = useState(client.state)
    const [contact, setContact] = useState(client.contact)
    const [phone, setPhone] = useState(client.phone)
    const [website, setWebsite] = useState(client.website)
    const [notes, setNotes] = useState(client.notes)
    const [isVisited, setIsVisited] = useState(client.isVisited)
    const [locationImage, setLocationImage] = useState(client.images.locationImage)
    const [contractImage, setContractImage] = useState(client.images.contractImage)
    const [licenseImage, setLicenseImage] = useState(client.images.licenseImage)
    const [humidorImage, setHumidorImage] = useState(client.images.humidorImage)
    
    useEffect(() => {
        console.log(isSuccess)
        if ( isSuccess && imgisSuccess) {
            //setClientname('')
            //setPassword('')
            //setRoles([])
            navigate('/clients')
            window.location.reload()
        }

    }, [isSuccess, imgisSuccess, navigate])

    address, city, state, contact, phone, website, notes, isVisited
    const onSaveClientClicked = async (e) => {
        const images = {locationImage:"",contractImage:"",licenseImage:"",humidorImage:""}
        if (locationImage?.name) images.locationImage = locationImage.name
        if (contractImage?.name) images.contractImage = contractImage.name
        if (licenseImage?.name) images.licenseImage = licenseImage.name
        if (humidorImage?.name) images.humidorImage = humidorImage.name
        console.log({ 
            id: client._id, 
            license: client.license, 
            dba: client.dba, 
            taxpayer: client.taxpayer, 
            images,
            address, city, state, 
            contact, phone, website, 
            notes, isVisited })
        await updateClient({ 
            id: client._id, 
            license: client.license, 
            dba: client.dba, 
            taxpayer: client.taxpayer, 
            images,
            address, city, state, 
            contact, phone, website, 
            notes, isVisited })
        const formData = new FormData();
        formData.append("file", locationImage);
        await uploadImage(formData)
    }
    /*const onUploadClicked = async (e) => {
        await uploadImage(locationImage)
    }*/

    const onAddressChanged = e => setAddress(e.target.value)
    const onCityChanged = e => setCity(e.target.value)
    const onStateChanged = e => setState(e.target.value)
    const onContactChanged = e => setContact(e.target.value)
    const onPhoneChanged = e => setPhone(e.target.value)
    const onWebsiteChanged = e => setWebsite(e.target.value)
    const onNotesChanged = e => setNotes(e.target.value)
    const onIsVisitedChanged = e => setIsVisited(!isVisited)
    const handleLocation = e => {
        console.log(e.target.files[0].name)
        setLocationImage(e.target.files[0])
        console.log(locationImage)
    }
    const handleContract = e => setContractImage(e.target.files[0])
    const handleHumidor = e => setHumidorImage(e.target.files[0])
    const handleLicense = e => setLicenseImage(e.target.files[0])

    let content

    content = 
        <div className='client'>
        <form className="form" onSubmit={e => e.preventDefault()}>
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
            <div className='image-upload'>
                <br />
                <p>Upload Images</p>
                <hr />
                <span>
                    <label htmlFor="location">Location Image: </label>
                    <input type="file" id="location" onChange={handleLocation}/>
                </span>
            </div>
            <button style={{marginBottom: '10px'}} className='client-button' onClick={onSaveClientClicked}>Save</button>
        </form>
            
        </div>

    return content
}

export default EditClientForm