import { useGetClientsQuery } from "./clientsApiSlice"
import Client from './Client'
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'

import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the grid
import { useState } from "react";

const ClientsList = () => {
    useTitle('Cigarlift: Clients List')
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
        pollingInterval: 120000,
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
            console.log(cols)
            setColDefs(cols)
        }

        content = (
            <div className="ag-theme-quartz" style={{width:"100%",height:"85%"}}>
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
                />
            </div>
        )
    }

    return content
}
export default ClientsList