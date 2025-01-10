import PulseLoader from 'react-spinners/PulseLoader'
import './Client.css'
import { memo } from 'react'
import { useGetClientImageQuery } from './clientsApiSlice'

const ClientImage = memo(function ClientImage({ src }) {
    let content 
    
    const { data: imageData, 
        isError,
        error, 
        isLoading, 
        isSuccess 
    } = useGetClientImageQuery(src)

    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) content =  <p>error</p>

    if (isSuccess) {

        content = 
            <div className='image-container'>
            {isLoading? <p>loading image...</p> :
            isError? <p>image error</p> :
            isSuccess? 
                <img src={`data:image/jpeg;base64,${imageData}`} alt="Location" className="location-image" />
                : <p>no image</p>
            }
            </div>
    }

    return content
})
export default ClientImage

export const NoImage = () => {

    return (
        <div className='image-container' 
            style={{ backgroundColor: "lightgrey", 
                    borderRadius:"50%",
                    flexDirection: 'column'}}>
            <p>no image...</p>
        </div>
    )
}