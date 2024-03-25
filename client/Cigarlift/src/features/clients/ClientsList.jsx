import { useGetClientsQuery } from "./clientsApiSlice"
import Client from './Client'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the grid
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import './Client.css'
import EditClientForm from "./EditClientForm";
import EditClient from "./EditClient";

const ClientsList = () => {
    useTitle('Cigarlift: Clients List')
    const navigate = useNavigate()
    const [clientSelected, setClientSelected] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false);
    
    const [colDefs, setColDefs] = useState([
        { headerName: "Company", 
            field: "taxpayer", filter: true, floatingFilter: true, flex: 2, hide: true },
        { headerName: "Name", 
            field: "dba", filter: true, floatingFilter: true, flex: 3, hide: false },
        { headerName: "Address", 
            field: "address", filter: true, floatingFilter: true, flex: 3, hide: true },
        { headerName: "City", 
            field: "city", filter: true, floatingFilter: true, flex: 2, hide: false },
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
        const { ids } = clients

        //const tableContent = ids?.length && ids.map(clientId => <Client key={clientId} clientId={clientId} />)
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
            // other grid options ...
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
            // log list of visible columns
            //console.log(cols.filter(col=>!col.hide).map(col=>col.headerName))
            setColDefs(cols)
        }
        const handleClick = (e) => {
            setClientSelected(e.data._id)//navigate(`/clients/${e.data._id}`)
            console.log(e.data._id)
        }
        const handleButtonClose = () => {
            setClientSelected(false)
            setIsClientEdit(false)
        }
        const handleButtonEdit  = () => setIsClientEdit(!isClientEdit)

        content = (
            <>
                {clientSelected? 
                isClientEdit ?
                <>
                    <div className="client-button-header">
                    <button className="client-button" onClick={handleButtonClose}><ArrowBackIosIcon /> Contacts</button>
                    <button className="client-button" onClick={handleButtonEdit}>Cancel</button>
                    </div>
                    <EditClient id={clientSelected} /> 
                </>
                :
                <>
                    <div className="client-button-header">
                    <button className="client-button" onClick={handleButtonClose}><ArrowBackIosIcon /> Contacts</button>
                    <button className="client-button" onClick={handleButtonEdit}>Edit</button>
                    </div>
                    <Client cid={clientSelected} /> 
                </>
                : null} 
                
                <div hidden={clientSelected} className="ag-theme-quartz" style={{width:"100%",height:"80%"}}>
                    <h2>Clients List</h2>
                    <div className="column--selectors">
                        <input type="checkbox" name="company" id="company" defaultChecked={false} 
                            onChange={e => handleSetCols("taxpayer", e.target.checked)} />
                        <label htmlFor="company">Company</label>
    
                        <input type="checkbox" name="name" id="name" defaultChecked={true} 
                            onChange={e => handleSetCols("dba", e.target.checked)} />
                        <label htmlFor="name">Name</label>
    
                        <input type="checkbox" name="address" id="address" defaultChecked={false} 
                            onChange={e => handleSetCols("address", e.target.checked)} />
                        <label htmlFor="address">Address</label>
    
                        <input type="checkbox" name="city" id="city" defaultChecked={true} 
                            onChange={e => handleSetCols("city", e.target.checked)} />
                        <label htmlFor="city">City</label>
                    </div>
                    
                    <AgGridReact
                        rowData={clients}
                        columnDefs={colDefs}
                        pagination={pagination}
                        paginationPageSize={paginationPageSize}
                        paginationPageSizeSelector={paginationPageSizeSelector}
                        gridOptions={gridOptions}
                        onRowClicked={(e) => handleClick(e)}
                    />
                </div>
            </>
        )
    }

    return content
}
export default ClientsList