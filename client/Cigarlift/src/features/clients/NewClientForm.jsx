import { useAddNewClientMutation, useUpdateClientMutation, useUploadClientImageMutation } from './clientsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import './Client.css'
import ClientImage, { NoImage } from './ClientImage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectClient } from '../order/orderSlice'
import { useSelector } from 'react-redux'

const NewClientForm = () => {
    useTitle('Cigarlift: New Client')

    const [addNewClient, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewClientMutation()
    const [uploadImage, {
        isLoading: imgisLoading,
        isSuccess: imgisSuccess,
        isError: imgisError,
        error: imgerror
    }] = useUploadClientImageMutation()

    const navigate = useNavigate()

    const client = useSelector(selectClient)

    const [license, setLicense] = useState()
    const [taxpayer, setTaxpayer] = useState()
    const [dba, setDba] = useState(client.dba)
    const [address, setAddress] = useState()
    const [city, setCity] = useState()
    const [state, setState] = useState("CA")
    const [contact, setContact] = useState()
    const [phone, setPhone] = useState()
    const [website, setWebsite] = useState()
    const [notes, setNotes] = useState()
    const [isVisited, setIsVisited] = useState()
    const [locationImage, setLocationImage] = useState()
    const [contractImage, setContractImage] = useState()
    const [licenseImage, setLicenseImage] = useState()
    const [humidorImage, setHumidorImage] = useState()
    
    useEffect(() => {
        console.log(isSuccess)
        if ( isSuccess && imgisSuccess) {
            navigate('/clients')
            window.location.reload()
        }

    }, [isSuccess, imgisSuccess, navigate])
    const close = () => {
        navigate('/clients')
        window.location.reload()
    }

    const onSaveClientClicked = async (e) => {
        const images = {locationImage: "",
            contractImage: "",
            licenseImage: "",
            humidorImage: ""}
        if (locationImage?.name) images.locationImage = license??phone + "Location." + locationImage.name.substring(locationImage.name.lastIndexOf('.') + 1)
        if (contractImage?.name) images.contractImage = license??phone + "Contract." + contractImage.name.substring(contractImage.name.lastIndexOf('.') + 1)
        if (licenseImage?.name) images.licenseImage = license??phone + "License." + licenseImage.name.substring(licenseImage.name.lastIndexOf('.') + 1)
        if (humidorImage?.name) images.humidorImage = license??phone + "Humidor." + humidorImage.name.substring(humidorImage.name.lastIndexOf('.') + 1)
        await addNewClient({ 
            license, 
            dba, 
            taxpayer, 
            images,
            address, city, state, 
            contact, phone, website, 
            notes, isVisited })

        let formData
        if (locationImage) {
            formData = new FormData();
            formData.append("file", locationImage, license??phone + "Location." + locationImage.name.substring(locationImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData)
        }
        if (contractImage) {
            formData = new FormData();
            formData.append("file", contractImage, license??phone + "Contract." + contractImage.name.substring(contractImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData)
        }
        if (licenseImage) {
            formData = new FormData()
            formData.append("file", licenseImage, license??phone + "License." + licenseImage.name.substring(licenseImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData) 
        }
        if (humidorImage) {
            formData = new FormData()
            formData.append("file", humidorImage, license??phone + "Humidor." + humidorImage.name.substring(humidorImage.name.lastIndexOf('.') + 1));
            await uploadImage(formData)
        }
        close()
    }

    const onDbaChanged = e => setDba(e.target.value)
    const onLicenseChanged = e => setLicense(e.target.value)
    const onTaxpayerChanged = e => setTaxpayer(e.target.value)
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
            <h1>New Client</h1>
        <form className="form" onSubmit={e => e.preventDefault()}>
            
            <table className='client-table'>
                <tbody>

                <tr>
                    <td className='label'><label htmlFor='license'>License #: </label></td>
                    <td><input id='license' value={license} onChange={onLicenseChanged} /></td>
                </tr>
                <tr>
                    <td className='label'><label htmlFor='taxpayer'>Taxpayer: </label></td>
                    <td><input id='taxpayer' value={taxpayer} onChange={onTaxpayerChanged} /></td>
                </tr>
                <tr>
                    <td className='label'><label htmlFor='dba'>DBA: </label></td>
                    <td><input id='dba' value={dba} onChange={onDbaChanged} /></td>
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

export default NewClientForm