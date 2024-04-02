import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PulseLoader from 'react-spinners/PulseLoader';
import { useGetCigarsQuery, useUpdateCigarMutation } from './cigarsApiSlice';

function Inventory() {
    const [cigars, setCigars] = useState([]);
    const { data, isLoading, isError, error, isSuccess } = useGetCigarsQuery();
    const [updateCigarMutation] = useUpdateCigarMutation();
    const [colDefs, setColDefs] = useState([
        { field: "name", filter: true, floatingFilter: true, flex: 2, editable: true },
        { field: "blend", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "size", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "price", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "quantity", filter: true, floatingFilter: true, flex: 1, editable: true },
    ])

    useEffect(() => {
        if (isSuccess) setCigars(data);
    }, [isSuccess, data]);

    

    if (isLoading) return <PulseLoader color="#CCC" />;
    if (isError) return <p>{error}</p>;

    if (isSuccess) {
        const handleCellValueChanged = (params) => {
            console.log("handleCellValueChanged");
            const { data: updatedCigar, colDef, newValue } = params;
            // Prepare the updated cigar object
            const updatedCigarData = {
                _id: updatedCigar._id, // Assuming each cigar has an ID
                [colDef.field]: newValue,
            };
            // Send the mutation request to update the cigar
            updateCigarMutation(updatedCigarData)
                .unwrap()
                .then((updatedCigar) => {
                    // Update the local state if mutation succeeds
                    const updatedCigars = cigars.map((cigar) =>
                        cigar._id === updatedCigar._id ? updatedCigar : cigar
                    );
                    setCigars(updatedCigars);
                })
                .catch((error) => console.error('Failed to update cigar:', error));
        };
        const pagination = true;
        const paginationPageSize = 20;
        const paginationPageSizeSelector = [20, 50, 100 ];
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
                    //onCellValueChanged={handleCellValueChanged}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    defaultColDef={{ editable: true }}
                />
            </div>
        );
    }

    return null;
}

export default Inventory;
