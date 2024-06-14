import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useGetClientsQuery } from "./clientsApiSlice"
import Client from './Client'
import PulseLoader from 'react-spinners/PulseLoader'
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the grid
import { useRef, useState } from "react";
import './Client.css'

const ClientSelect = ({ close, setSelection }) => {

    const [clientSelected, setClientSelected] = useState(false);
    const [isClientEdit, setIsClientEdit] = useState(false);

    const gridApiRef = useRef(null);

    const onGridReady = (params) => {
        gridApiRef.current = params.api;
    };
    
    const [colDefs, setColDefs] = useState([
        { headerName: "Company", 
            field: "taxpayer", filter: true, floatingFilter: true, flex: 2, hide: true },
        { headerName: "Name", 
            field: "dba", filter: true, floatingFilter: true, flex: 3, hide: false,headerCheckboxSelection: true,
            checkboxSelection: true, },
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
            rowSelection: "multiple",
            suppressRowClickSelection: true,
            //onFirstDataRendered: (params) => {
            //    params.api.paginationGoToPage(pageToNavigate)
            //}
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
        const handleAddSelected = () => {
            if (gridApiRef?.current) {
                const selectedData = gridApiRef.current.getSelectedRows();
                setSelection(selectedData);
                close()
            }
        }

        content = (
            <>
            {clientSelected? 
                <Client cid={clientSelected} close={handleButtonClose} />
            : null} 
            <div className={clientSelected? "hidden select-client-table":"select-client-table"}>
                <button onClick={handleAddSelected} className="add-selection-button">Add Selection</button>
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
                <div className="ag-theme-quartz" style={{width:"100%",height:"75vh",marginBottom:"56px"}} >
                    <AgGridReact
                        rowData={clients}
                        columnDefs={colDefs}
                        pagination={pagination}
                        paginationPageSize={paginationPageSize}
                        paginationPageSizeSelector={paginationPageSizeSelector}
                        gridOptions={gridOptions}
                        onRowClicked={(e) => handleClick(e)}
                        onGridReady={onGridReady}
                    />
                </div>
            </div>
            </>
        )
    }

    return (
        <div className='clientselect'>
            <Dialog open onClose={close}>
                <DialogTitle>Select Client</DialogTitle>
                <div style={{ margin: "10px" }}>
                {content}
                </div>
            </Dialog>
        </div>
    )
}

export default ClientSelect