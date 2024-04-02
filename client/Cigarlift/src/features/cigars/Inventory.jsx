import { useEffect, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { useGetCigarsQuery, useUpdateCigarMutation } from './cigarsApiSlice';
import CigarTable from './CigarTable';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PulseLoader from 'react-spinners/PulseLoader';

function Inventory() {
    const [cigars, setCigars] = useState([]);
    const [updateCigarMutation] = useUpdateCigarMutation();

    const [colDefs, setColDefs] = useState([
        { field: "name", filter: true, floatingFilter: true, flex: 2, editable: true },
        { field: "blend", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "size", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "price", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "quantity", filter: true, floatingFilter: true, flex: 1, editable: true },
    ])

    const { data, isLoading, isError, error, isSuccess } = useGetCigarsQuery()

    useEffect(() => {
        if (isSuccess) setCigars(data)
    }, [isSuccess, data])
  

    if (isLoading) return <PulseLoader color="#CCC" />;
    if (isError) return <p>{error}</p>;

    if (isSuccess) {
        //return <CigarTable data={data} />
        const handleCellValueChanged = async (params) => {
            console.log("updating...")
            const { data: updatedCigar, colDef, newValue } = params;
            // Prepare the updated cigar object
            const updatedCigarData = {
                _id: updatedCigar._id,
                [colDef.field]: newValue,
            };
            try {
                // Send the mutation request to update the cigar
                const response = await updateCigarMutation(updatedCigarData)
                if (response.data) {
                    // Update the local state with the updated data
                    setCigars((prevCigars) =>
                        prevCigars.map((cigar) =>
                            cigar._id === updatedCigar._id ? response.data : cigar
                        )
                    );
                } else {
                    console.error('Failed to update cigar:', response.error);
                }
            } catch (error) {
                console.error('Failed to update cigar:', error);
            }
            console.log("updated cigar")
            // Update the local state if mutation succeeds
            //console.log(cigars)
            /*const updatedCigars = cigars.map((cigar) =>
                cigar._id === updatedCigar._id ? updatedCigar : cigar
            );*/
            //console.log(updatedCigars)
            //setCigars(updatedCigars);
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
}

export default Inventory