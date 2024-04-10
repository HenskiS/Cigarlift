import { useState, useEffect } from "react";
import { useGetCigarsQuery } from "../cigars/cigarsApiSlice";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PulseLoader from 'react-spinners/PulseLoader';


function Order() {
    const { data, 
      isLoading, 
      isError, 
      error, 
      isSuccess 
    } = useGetCigarsQuery()

    let content
    if (isLoading) content = <PulseLoader color="#CCC" />
    if (isError) content = <p>Error: {error.error}</p>
    
    if (isSuccess) {
      content = (
        <div className="order">
          <h2>Order</h2>
          {data.map(cigar => {
            return (
              <p key={cigar._id}>{cigar.name}</p>
            )
          })}
        </div>
      )
    }
    
    return content
  } 
  
  export default Order
  