import { useState, useEffect } from "react";
import { useGetCigarsQuery } from "../cigars/cigarsApiSlice";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PulseLoader from 'react-spinners/PulseLoader';
import { useDispatch, useSelector } from "react-redux";
import { selectCart, updateQuantity } from "./orderSlice";


function NewOrderForm() {
    const { data, 
      isLoading, 
      isError, 
      error, 
      isSuccess 
    } = useGetCigarsQuery()
    
    const dispatch = useDispatch()
    const cart = useSelector(selectCart)

    let content
    if (isLoading) content = <PulseLoader color="#CCC" />
    if (isError) content = <p>Error: {error.error}</p>
    
    if (isSuccess) {
        console.log(cart)

    content = (
    <div className="order cigar-list">
        <h1>New Order</h1>
        <div className="order-header">
            <div className="client-header">

            </div>
            <div className="seller-header">

            </div>
        </div>
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
                    <td>{cigar.name}</td>
                    <td>{cigar.blend}</td>
                    <td>{cigar.size}</td>
                    <td>${cigar.price.toFixed(2)}</td>
                    <td>{cigar.qty}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
    }
    
    return content
  } 
  
  export default NewOrderForm
  