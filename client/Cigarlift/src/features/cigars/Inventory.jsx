import { useEffect, useState } from 'react';
import { useAddNewCigarMutation, useGetCigarsQuery, useUpdateCigarMutation } from './cigarsApiSlice';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import PulseLoader from 'react-spinners/PulseLoader';

function Inventory() {
    const [cigars, setCigars] = useState([]);
    const [updateCigarMutation] = useUpdateCigarMutation();
    const [addNewCigarMutation] = useAddNewCigarMutation()

    const [name, setName] = useState();
    const [blend, setBlend] = useState();
    const [size, setSize] = useState();
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();


    const colDefs = [
        { field: "name", filter: true, floatingFilter: true, flex: 2, editable: true },
        { field: "blend", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "size", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "price", filter: true, floatingFilter: true, flex: 1, editable: true },
        { field: "quantity", filter: true, floatingFilter: true, flex: 1, editable: true },
    ]

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
        };
        const handleSubmit = async () => {
            const cigar = {name, blend, size, price, quantity}
            console.log(cigar)
            const response = await addNewCigarMutation(cigar)
            console.log(response)
        }
        const pagination = true;
        const paginationPageSize = 20;
        const paginationPageSizeSelector = [ 20, 50, 100 ];
        const gridOptions = {
            readOnlyEdit: true,
            onCellEditRequest: handleCellValueChanged
        }
    
        return (
            <div className='inventory'>
                <h2>Inventory</h2>
                <div className="new-cigar">
                    <input type="text" id="name" placeholder='name' value={name?? ""} onChange={(e)=>setName(e.target.value)} />
                    <input type="text" id="blend" placeholder='blend' value={blend?? ""} onChange={(e)=>setBlend(e.target.value)} />
                    <input type="text" id="size" placeholder='size' value={size?? ""} onChange={(e)=>setSize(e.target.value)} />
                    <input type="number" id="price" placeholder='price' value={price?? ""} onChange={(e)=>setPrice(e.target.value)} />
                    <input type="number" id="quantity" placeholder='quantity' value={quantity?? ""} onChange={(e)=>setQuantity(e.target.value)} />
                    <button className="new-cigar-submit" onClick={handleSubmit}>Submit</button>
                </div>
                <div className="ag-theme-quartz" style={{ height: 500, width: '100%', marginBottom: "100px" }}>
                    <AgGridReact 
                        rowData={cigars}
                        columnDefs={colDefs}
                        gridOptions={gridOptions}
                        pagination={pagination}
                        paginationPageSize={paginationPageSize}
                        paginationPageSizeSelector={paginationPageSizeSelector}
                        defaultColDef={{ editable: true }}
                        singleClickEdit
                        rowSelection='single'
                    />
                </div>
            </div>
        )
    
    }
}

export default Inventory