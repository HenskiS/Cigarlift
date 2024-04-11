import { useState, useEffect } from "react";
import { useGetCigarsQuery } from "../cigars/cigarsApiSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import { useDispatch, useSelector } from "react-redux";
import { selectCart, updateQuantity, removeCigar } from "./orderSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAddNewOrderMutation } from "./ordersApiSlice";


function NewOrderForm() {
    const { data, 
      isLoading, 
      isError, 
      error, 
      isSuccess 
    } = useGetCigarsQuery()
    
    const dispatch = useDispatch()
    const cart = useSelector(selectCart)
    const [addNewOrderMutation] = useAddNewOrderMutation()

    const [isCash, setIsCash] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [isMoneyorder, setIsMoneyorder] = useState(false)
    const [total, setTotal] = useState(0)
    const [payed, setPayed] = useState(0)
    const [cash, setCash] = useState()
    const [check, setCheck] = useState()
    const [moneyorder, setMoneyorder] = useState()

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
    }, [cash, check, isCash, isCheck, isMoneyorder, moneyorder])

    const handleRemoveCigar = (id) => {
        dispatch(removeCigar(id))
    }

    const handleSubmit = () => {
        let p = (Math.ceil(payed*100)/100)
        let t = (Math.ceil(total*100)/100)
        if (p < t) {
            return alert(`Payment: $${p.toFixed(2)} is less than Total: $${t.toFixed(2)}`)
        }
        if (p > t){
            return alert(`Payment: $${p.toFixed(2)} is greater than Total: $${t.toFixed(2)}`)
        }
        //addNewOrderMutation
    }

    let content
    if (isLoading) content = <PulseLoader color="#CCC" />
    if (isError) content = <p>Error: {error.error}</p>
    
    if (isSuccess) {

    content = (
    <div className="order cigar-list">
        <h1>New Order</h1>
        <div className="order-header">
            <div className="client-header">

            </div>
            <div className="seller-header">

            </div>
        </div>
        <h3>Cigars</h3>
        <hr />
        <table className="cigarlist-table">
            <thead>
                <tr>
                <td>Name</td>
                <td>Blend</td>
                <td>Size</td>
                <td>Price</td>
                <td>Qty</td>
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
                <td></td>
                <td>Name</td>
                <td>Blend</td>
                <td>Size</td>
                <td>Price</td>
                <td>Qty</td>
                </tr>
            </thead>
            <tbody>
                {cart?.map(cigar => (
                    <tr key={cigar._id}>
                    <td>
                        <button className="remove-cigar-button"
                        onClick={() => handleRemoveCigar(cigar._id)}>
                        <DeleteIcon /></button>
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
            <button className="submit-order" onClick={handleSubmit}>Submit Order</button>
            <br />
            <br />
            <br />
        </div>
    </div>
    )
    }
    
    return content
  } 
  
  export default NewOrderForm
  