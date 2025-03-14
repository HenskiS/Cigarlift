import { useGetClientsQuery } from "./clientsApiSlice"
import Client from './Client'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Client.css'
import ClientsNearby from "./ClientsNearby";

const ClientsList = () => {
    useTitle('Cigarlift: Clients List')
    
    const navigate = useNavigate()
    const [clientSelected, setClientSelected] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false);
    const [showOnlyOrdered, setShowOnlyOrdered] = useState(true);
    
    const [colDefs, setColDefs] = useState([
        { headerName: "Company", 
            field: "taxpayer", filter: true, floatingFilter: true, flex: 2, hide: true },
        { headerName: "Name", 
            field: "dba", filter: true, floatingFilter: true, flex: 3, hide: false },
        { headerName: "Address", 
            field: "address", filter: true, floatingFilter: true, flex: 3, hide: true },
        { headerName: "City", 
            field: "city", filter: true, floatingFilter: true, flex: 2, hide: false },
        { headerName: "Order Count", 
            field: "orders", filter: true, floatingFilter: true, flex: 1, hide: true },
        { headerName: "Last Order Date", 
            field: "lastOrderDate", filter: true, floatingFilter: true, flex: 2, hide: true,
            valueFormatter: params => {
                if (!params.value || params.value === null) return '-';
                const date = new Date(params.value);
                return date.getTime() > 0 ? date.toLocaleDateString() : '-';
            }
        },
    ])

    const {
        data: clients,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetClientsQuery('clientsList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <PulseLoader color={"#CCC"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const pagination = true;
        const paginationPageSize = 20;
        const paginationPageSizeSelector = [20, 50, 100, 200];
        const gridOptions = {
            autoSizeStrategy: {
                type: 'fitGridWidth',
                defaultMinWidth: 100,
                columnLimits: [
                    {
                        colId: 'country',
                        minWidth: 900
                    }
                ]
            },
        }

        const handleSetCols = (field, value) => {
            console.log(field + ": " + value)
            let cols
            cols = colDefs.map(c => {
                if (c.field === field) {
                    c.hide = !value
                }
                return c
            })
            setColDefs(cols)
        }
        const handleClick = (e) => {
            setClientSelected(e.data._id)
            console.log(e.data._id)
        }
        const handleNewClient = () => {
            navigate("/clients/new")
        }
        const handleButtonClose = () => {
            setClientSelected(false)
            setIsClientEdit(false)
        }
        
        const handleToggleOrdered = () => {
            setShowOnlyOrdered(!showOnlyOrdered);
        }

        const filteredClients = showOnlyOrdered
            ? clients.filter(client => client.orders > 0)
            : clients;

        content = (
            <div style={{width: '100%'}}>
                {clientSelected ? 
                    <Client cid={clientSelected} close={handleButtonClose} />
                : null} 
                <div hidden={clientSelected}>
                    <h1>Client List</h1>
                    <button onClick={handleNewClient}>New Client</button>
                    <div className="column--selectors">
                        <div className="checkbox-wrapper">
                            <input type="checkbox" name="company" id="company" defaultChecked={false} 
                                onChange={e => handleSetCols("taxpayer", e.target.checked)} />
                            <label htmlFor="company">Company</label>
                        </div>
                        <div className="checkbox-wrapper">
                            <input type="checkbox" name="name" id="name" defaultChecked={true} 
                                onChange={e => handleSetCols("dba", e.target.checked)} />
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="checkbox-wrapper">
                            <input type="checkbox" name="address" id="address" defaultChecked={false} 
                                onChange={e => handleSetCols("address", e.target.checked)} />
                            <label htmlFor="address">Address</label>
                        </div>
                        <div className="checkbox-wrapper">
                            <input type="checkbox" name="city" id="city" defaultChecked={true} 
                                onChange={e => handleSetCols("city", e.target.checked)} />
                            <label htmlFor="city">City</label>
                        </div>
                        <div className="checkbox-wrapper">
                            <input type="checkbox" name="orderCount" id="orderCount" defaultChecked={false} 
                                onChange={e => handleSetCols("orders", e.target.checked)} />
                            <label htmlFor="orderCount">Order Count</label>
                        </div>
                        <div className="checkbox-wrapper">
                            <input type="checkbox" name="lastOrderDate" id="lastOrderDate" defaultChecked={false} 
                                onChange={e => handleSetCols("lastOrderDate", e.target.checked)} />
                            <label htmlFor="lastOrderDate">Last Order Date</label>
                        </div>
                    </div>
                    <div className="order-toggle">
                        <input
                            type="checkbox"
                            id="showOnlyOrdered"
                            checked={showOnlyOrdered}
                            onChange={handleToggleOrdered}
                        />
                        <label htmlFor="showOnlyOrdered">Our accounts</label>
                    </div>
                    <div className="ag-theme-quartz" style={{width:"100%",height:"75vh",marginBottom:"56px"}} >
                        <AgGridReact
                            rowData={filteredClients}
                            columnDefs={colDefs}
                            pagination={pagination}
                            paginationPageSize={paginationPageSize}
                            paginationPageSizeSelector={paginationPageSizeSelector}
                            gridOptions={gridOptions}
                            onRowClicked={(e) => handleClick(e)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return content
}
export default ClientsList