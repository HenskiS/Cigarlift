import { useUpdateClientMutation, useUploadClientImageMutation } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage, { NoImage } from './ClientImage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EditClientForm = ({ client, close }) => {
    useTitle('Cigarlift: Client')
    console.log(client)

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
    const [locationImage, setLocationImage] = useState()
    const [contractImage, setContractImage] = useState()
    const [licenseImage, setLicenseImage] = useState()
    const [humidorImage, setHumidorImage] = useState()
    
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

    const onSaveClientClicked = async (e) => {
        const images = {locationImage: client.images.locationImage ?? "",
            contractImage: client.images.contractImage ?? "",
            licenseImage: client.images.licenseImage ?? "",
            humidorImage: client.images.humidorImage ?? ""}
        if (locationImage?.name) images.locationImage = client.license + "Location." + locationImage.name.substring(locationImage.name.lastIndexOf('.') + 1)
        if (contractImage?.name) images.contractImage = client.license + "Contract." + contractImage.name.substring(contractImage.name.lastIndexOf('.') + 1)
        if (licenseImage?.name) images.licenseImage = client.license + "License." + licenseImage.name.substring(licenseImage.name.lastIndexOf('.') + 1)
        if (humidorImage?.name) images.humidorImage = client.license + "Humidor." + humidorImage.name.substring(humidorImage.name.lastIndexOf('.') + 1)
        await updateClient({ 
            id: client._id, 
            license: client.license, 
            dba: client.dba, 
            taxpayer: client.taxpayer, 
            images,
            address, city, state, 
            contact, phone, website, 
            notes, isVisited })
        let formData
        if (locationImage) {
            formData = new FormData();
            formData.append("file", locationImage, client.license + "Location." + locationImage.name.substring(locationImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData)
        }
        if (contractImage) {
            formData = new FormData();
            formData.append("file", contractImage, client.license + "Contract." + contractImage.name.substring(contractImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData)
        }
        if (licenseImage) {
            formData = new FormData()
            formData.append("file", licenseImage, client.license + "License." + licenseImage.name.substring(licenseImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData) 
        }
        if (humidorImage) {
            formData = new FormData()
            formData.append("file", humidorImage, client.license + "Humidor." + humidorImage.name.substring(humidorImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData)
        }
        close()
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
    const onIsVisitedChanged = () => setIsVisited(!isVisited)
    const handleLocation = e => setLocationImage(e.target.files[0])
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
                
                {/*<tr>
                    <td className='label'><label htmlFor='notes'>Notes: </label></td>
                    <td><textarea rows={3} id='notes' value={notes} onChange={onNotesChanged} /></td>
                </tr>*/}
                
                <tr>
                    <td className='label'><label htmlFor='isVisited'>Visited: </label></td>
                    <td><input type='checkbox' id='isVisited' checked={isVisited} onChange={onIsVisitedChanged} /></td>
                </tr>
                </tbody>
            </table>
            <div className='image-upload'>
                <p>Upload Images</p>
                <span>
                    <label className='image-upload-label' htmlFor="location">Location Image: </label>
                    <input type="file" id="location" onChange={handleLocation}/>
                </span>
                <span>
                    <label htmlFor="contract">Contract Image: </label>
                    <input type="file" id="contract" onChange={handleContract}/>
                </span>
                <span>
                    <label htmlFor="license">License Image: </label>
                    <input type="file" id="license" onChange={handleLicense}/>
                </span>
                <span>
                    <label htmlFor="humidor">Humidor Image: </label>
                    <input type="file" id="humidor" onChange={handleHumidor}/>
                </span>
            </div>
            <button style={{marginBottom: '10px'}} className='client-button' onClick={onSaveClientClicked}>Save</button>
        </form>
            
        </div>

    return content
}

export default EditClientForm