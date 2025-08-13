import { useState, useEffect } from "react"
import { useGetCigarsQuery } from "../cigars/cigarsApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import { useDispatch, useSelector } from "react-redux"
import { selectCart, updateQuantity, removeCigar, selectClient } from "./orderSlice"
import DeleteIcon from '@mui/icons-material/Delete'
import { useAddNewOrderMutation } from "./ordersApiSlice"
import { useUpdateClientMutation } from "../clients/clientsApiSlice"
import { useNavigate } from 'react-router-dom';


function NewOrderForm() {
    const { data, 
      isLoading, 
      isError, 
      error, 
      isSuccess 
    } = useGetCigarsQuery()

    const dispatch = useDispatch()
    const cart = useSelector(selectCart)
    const client = useSelector(selectClient)
    const [addNewOrderMutation] = useAddNewOrderMutation()
    const [updateClientMutation] = useUpdateClientMutation()
    const [isCash, setIsCash] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [isMoneyorder, setIsMoneyorder] = useState(false)
    const [total, setTotal] = useState(0)
    const [payed, setPayed] = useState(0)
    const [cash, setCash] = useState()
    const [check, setCheck] = useState()
    const [moneyorder, setMoneyorder] = useState()
    const [notes, setNotes] = useState(client.notes)
    const [isTestOrder, setIsTestOrder] = useState(client ? false : true)

    const navigate = useNavigate()

    useEffect(()=> {
        if (cart.length) {
            const tot = cart.map(cigar => cigar.qty * cigar.price).reduce((a,b)=>a+b)
            setTotal(tot)
        } else setTotal(0)
    }, [cart])
    useEffect(() => {
        let p = 0
        if (isCash && cash) p += parseFloat(cash)
        if (isCheck && check) p += parseFloat(check)
        if (isMoneyorder && moneyorder) p += parseFloat(moneyorder)
        setPayed(p)
    }, [cash, check, moneyorder, isCash, isCheck, isMoneyorder ])

    const handleRemoveCigar = (id) => {
        dispatch(removeCigar(id))
    }

    const handleSubmit = async () => {
        if (!cart.length) {
            return alert('No cigars have been selected')
        }
        if (!client.dba) {
            return alert('No client has been selected')
        }
        let p = (Math.ceil(payed*100)/100)
        let t = (Math.ceil(total*100)/100)
        if (p < t) {
            return alert(`Payment: $${p.toFixed(2)} is less than Total: $${t.toFixed(2)}`)
        }
        if (p > t){
            return alert(`Payment: $${p.toFixed(2)} is greater than Total: $${t.toFixed(2)}`)
        }
        const order = { 
            client, 
            cigars: cart, 
            total: t, 
            payed: {cash: isCash? cash : 0, 
                    check: isCheck? check : 0, 
                    moneyorder: isMoneyorder? moneyorder : 0
                },
            isTestOrder
            }
            console.log(order)
        const response = await addNewOrderMutation(order)
        if (response.data) {
            alert("Order added successfully")
        }
        else if (response.error) return alert(response.error.data.error ?? "error")
        else return alert('error')
        // update notes
        if (notes !== client.notes) {
            const response2 = await updateClientMutation({...client, notes: notes})
            console.log(response2)
        }
        
        window.location.reload()
    }

    let content
    if (isLoading) content = <PulseLoader color="#CCC" />
    if (isError) content = <p>Error: {error.error}</p>
    
    if (isSuccess) {

    content = (
        <div className="order cigar-list">
            <h1>New Order</h1>
            <div className="order-header">
                <div className="seller-header">
                    <p>Cigarliftdelivery.com</p>
                    <p>Info@cigarliftdelivery.com</p>
                    <p>(562) 228-5096</p>
                </div>
                <div className="order-client-header">
                    {client.dba? 
                    <>
                        {client.taxpayer && <p>{client.taxpayer}</p>}
                        {client.dba && <p>{client.dba}</p>}
                        {client.address && <p>{client.address}</p>}
                        {client.city && <p>{client.city}</p>}
                        {(client.state || client.zip) && (
                            <p>{[client.state, client.zip].filter(Boolean).join(" ")}</p>
                        )}
                        {client.contact && <p>{client.contact}</p>}
                    </>
                    :
                    <button style={{ padding: '8px', border: '1px solid lightgray', 
                                     backgroundColor: '#1976d2', color: 'white' }}
                            onClick={()=>navigate('/clients')}>
                        Select Client
                    </button>
                    }
                </div>
            </div>
            <h3>Cigars</h3>
            <hr />
            <table className="cigarlist-table">
                <thead>
                    <tr>
                        <td>Name</td><td>Blend</td><td>Size</td><td>Price</td><td>Qty</td>
                    </tr>
                </thead>
                <tbody>
                    {data.map(cigar => (
                        <tr key={cigar._id} className={ cart.find(oldCigar => oldCigar._id === cigar._id) ? "row-selected" : ""}>
                        <td>{cigar.name}</td>
                        <td>{cigar.blend}</td>
                        <td>{cigar.size}</td>
                        <td>${cigar.price.toFixed(2)}</td>
                        <td>
                            <input className='cigar-qty cigar-col' type="number" min={1} placeholder='Qty' 
                                value={cart.find(oldCigar => oldCigar._id === cigar._id)?.qty ?? "" } 
                                onChange={ (e) => dispatch(updateQuantity({cigar: cigar, qty: e.target.value})) } 
                            />
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <h3>Summary</h3>
            <hr />
            <table className="cigarlist-table">
                <thead>
                    <tr>
                        <td></td><td>Name</td><td>Blend</td><td>Size</td><td>Price</td><td>Qty</td>
                    </tr>
                </thead>
                <tbody>
                    {cart?.map(cigar => (
                        <tr key={cigar._id}>
                        <td>
                            <DeleteIcon className="remove-cigar-button" onClick={() => handleRemoveCigar(cigar._id)}/>
                        </td>
                        <td>{cigar.name}</td>
                        <td>{cigar.blend}</td>
                        <td>{cigar.size}</td>
                        <td>${cigar.price.toFixed(2)}</td>
                        <td>{cigar.qty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="order-totals">
                <h4>Total</h4>
                <p>${(Math.ceil(total*100)/100).toFixed(2)}</p>
            </div>
    
            <div className="payment">
                <h3>Payment Method</h3>
                <hr />
                <div className="payment-type">
                    <span>
                        <input type="checkbox" id="cash" checked={isCash} onChange={e => setIsCash(e.target.checked)}/>
                        <label htmlFor="cash">Cash</label>
                    </span>
                    <span>
                        <input type="checkbox" id="check" checked={isCheck} onChange={e => setIsCheck(e.target.checked)}/>
                        <label htmlFor="check">Check</label>
                    </span>
                    <span>
                        <input type="checkbox" id="moneyorder" checked={isMoneyorder} onChange={e => setIsMoneyorder(e.target.checked)}/>
                        <label htmlFor="moneyorder">Money Order</label>
                    </span>
                </div>
                <div className="payment-amounts">
                    <input type="number" disabled={!isCash} value={isCash? cash ?? "" : ""} placeholder="$ Cash" onChange={e => setCash(e.target.value)}/>
                    <input type="number" disabled={!isCheck} value={isCheck? check ?? "" : ""} placeholder="$ Check" onChange={e => setCheck(e.target.value)}/>
                    <input type="number" disabled={!isMoneyorder} value={isMoneyorder? moneyorder ?? "" : ""} placeholder="$ MO" onChange={e => setMoneyorder(e.target.value)}/>
                </div>
                <div className="order-totals">
                    <h4>Payed</h4>
                    <p>${(Math.ceil(payed*100)/100).toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '160px', margin: 'auto' }}>
                    <span style={{ marginBottom: '10px' }}>
                        <input type="checkbox" id="testOrder" checked={isTestOrder} onChange={e => setIsTestOrder(e.target.checked)}/>
                        <label htmlFor="testOrder">Test Order</label>
                    </span>
                    <button className="submit-order" onClick={handleSubmit}>{isTestOrder ? 'Submit Test Order':'Submit Order'}</button>
                </div>
                <br />
                <br />
                <br />
            </div>
            <h3>Client Notes</h3>
            <textarea 
                className="client-notes"
                placeholder="Client notes (optional)..." 
                value={notes} 
                onChange={e  => setNotes(e.target.value)}
            />
        </div>
    )
    }
    
    return content
  } 
  
  export default NewOrderForm
  