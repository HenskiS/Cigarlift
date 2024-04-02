import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PulseLoader from 'react-spinners/PulseLoader';
import { useGetCigarsQuery, useUpdateCigarMutation } from './cigarsApiSlice';

function CigarTable({ data }) {
    const [cigars, setCigars] = useState([]);
    const [updateCigarMutation] = useUpdateCigarMutation();

    const [colDefs, setColDefs] = useState([
        { field: "name", filter: true, floatingFilter: true, flex: 2, editable: true },
        { field: "blend", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "size", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "price", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "quantity", filter: true, floatingFilter: true, flex: 1, editable: true },
    ])

    useEffect(() => {
        if (data) setCigars(data)
    }, [data, cigars])


    const handleCellValueChanged = async (params) => {
        console.log("handleCellValueChanged");
        console.log("0");
        const { data: updatedCigar, colDef, newValue } = params;
        console.log("1");
        // Prepare the updated cigar object
        const updatedCigarData = {
            _id: updatedCigar._id, // Assuming each cigar has an ID
            [colDef.field]: newValue,
        };
        // Send the mutation request to update the cigar
        const response = await updateCigarMutation(updatedCigarData)
        console.log("2");
        console.log(response)
        // Update the local state if mutation succeeds
        const updatedCigars = cigars.map((cigar) =>
            cigar._id === updatedCigar._id ? updatedCigar : cigar
        );
        console.log(updatedCigars)
        setCigars(updatedCigars);
        
            //.catch((error) => console.error('Failed to update cigar:', error));
    };
    const pagination = true;
    const paginationPageSize = 20;
    const paginationPageSizeSelector = [ 2, 20, 50, 100 ];
    const gridOptions = {
        readOnlyEdit: true,
        onCellEditRequest: handleCellValueChanged
    }

    return (
        <div className="ag-theme-quartz" style={{ height: 500, width: '100%', marginBottom: "100px" }}>
            <h2>Inventory</h2>
            <AgGridReact
                rowData={cigars}
                columnDefs={colDefs}
                gridOptions={gridOptions}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                defaultColDef={{ editable: true }}
            />
        </div>
    )

}

export default CigarTable;
