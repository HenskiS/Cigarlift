import { useState, useEffect, useRef } from "react"
import { useGetCigarsQuery } from "../cigars/cigarsApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import { useDispatch, useSelector } from "react-redux"
import { selectCart, updateQuantity, removeCigar, selectClient } from "./orderSlice"
import DeleteIcon from '@mui/icons-material/Delete'
import { useAddNewOrderMutation, useGetOrderByIdQuery } from "./ordersApiSlice"
import { usePDF, Margin } from 'react-to-pdf'
import { useNavigate, useParams } from "react-router-dom"
import useTitle from "../../hooks/useTitle"
import logo from "../../assets/cigarlift-logo-white.png"


function NewOrderForm() {
    useTitle('Cigarlift: Order')
    const navigate = useNavigate
    
    const {id: paramId} = useParams()

    const { data, 
      isLoading, 
      isError, 
      error, 
      isSuccess 
    } = useGetOrderByIdQuery(paramId)

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) content = <p>error</p>

    if (isSuccess) {
      console.log(data)
        content = (
        <div className="order-page">
            <div className="order-pdf-header">
                <img src={logo} alt="logo" className="order-logo" />
            </div>
        <div className="toPDF">
            <div className="order-header">
                <div className="seller-header">
                    <p>Cigarlift.com</p>
                    <p>(949) 796-2644</p>
                    <p>(949) 796-2980</p>
                </div>
                <div className="order-client-header">
                    <p>Bill to:</p>
                    <p>{data.client.taxpayer}</p>
                    <p>{data.client.dba}</p>
                    <p>{data.client.address}</p>
                    <p>{data.client.city}</p>
                    <p>{data.client.state + " " + data.client.zip}</p>
                    <p>{data.client.contact??""}</p>
                </div>
                
            </div>
            <h3>Summary</h3>
            <div><hr /></div>
            <table className="cigarlist-table">
                <thead>
                    <tr>
                        <td>Name</td><td>Blend</td><td>Size</td><td>Price</td><td>Qty</td>
                    </tr>
                </thead>
                <tbody>
                    {data.cigars?.map(cigar => (
                        <tr key={cigar._id}>
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
                <p>${(Math.ceil(data.total*100)/100).toFixed(2)}</p>
            </div>
            <div><hr /></div>
            <div className="payment-amounts">
                <h4>Payment Method</h4>
                {data.payed.cash? <p>Cash: ${parseFloat(data.payed.cash).toFixed(2)}</p> : null}
                {data.payed.check? <p>Check: ${parseFloat(data.payed.check).toFixed(2)}</p> : null}
                {data.payed.moneyorder? <p>Money Order: ${parseFloat(data.payed.moneyorder).toFixed(2)}</p> : null}
            </div>
            
            <div className="order-totals">
                <h4>Total Payment</h4>
                <p>${(Math.ceil((data.payed.cash + data.payed.check + data.payed.moneyorder)*100)/100).toFixed(2)}</p>
            </div>
        </div>
    </div>
    )
    }

    return content
  } 
  
  export default NewOrderForm
  