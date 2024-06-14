import { useState, useEffect } from 'react'
import ClientSelect from '../clients/ClientSelect';

const RoutePlanner = () => {

    const [isClientSelect, setIsClientSelect] = useState(false)
    const [selection, setSelection] = useState([])

    return (
        <div className='routeplanner'>
            <h2>Route</h2>
            <button onClick={() => setIsClientSelect(true)}>Client Select</button>
            {isClientSelect? <ClientSelect close={()=>setIsClientSelect(false)} setSelection={setSelection} /> : null}
            {selection.map(c => (
                <p key={c._id}>{c.dba}</p>
            ))}
        </div>
    )
}

export default RoutePlanner