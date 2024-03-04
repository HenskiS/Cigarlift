import { useState, useEffect } from "react";
import axios from 'axios';


function Order() {
    const [data, setData] = useState([])
    useEffect(() => {
      const getUser = () => {
        fetch("http://localhost:5000/order/test", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        })
          .then((response) => {
            if (response.status === 200) return response.json();
            throw new Error("authentication has been failed!");
          })
          .then((resObject) => {
            setData(resObject.data);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getUser();
    }, []);

    return (
      <>
        <h2>Order</h2>
        {data.map((d, index) => (
          <p key={index}>{d}</p>
        ))}
      </>
    )
  } 
  
  export default Order
  