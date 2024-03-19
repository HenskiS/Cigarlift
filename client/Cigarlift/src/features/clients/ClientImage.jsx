import PulseLoader from 'react-spinners/PulseLoader'
import { useGetItineraryImageQuery } from '../drive/itineraryApiSlice'
import './Client.css'
import { memo } from 'react'

const ClientImage = memo(function ClientImage({ src }) {
    console.log("img src: " + src)
    let content 
    if (src) {
        const { data: imageData, 
            isError,
            error, 
            isLoading, 
            isSuccess 
        } = useGetItineraryImageQuery(src)

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
    }
    else {
        content = 
        <div className='image-container' 
            style={{ backgroundColor: "lightgrey", 
                    borderRadius:"50%"}}>
            <p>no image...</p>
        </div>
    }

    return content
})
export default ClientImage