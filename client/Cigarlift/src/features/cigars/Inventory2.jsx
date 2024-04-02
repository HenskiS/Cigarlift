import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import PulseLoader from 'react-spinners/PulseLoader';
import { useGetCigarsQuery, useUpdateCigarMutation } from './cigarsApiSlice';


function Inventory() {
    const [cigars, setCigars] = useState([]);
    const { data, isLoading, isError, error, isSuccess } = useGetCigarsQuery();
    const [updateCigarMutation] = useUpdateCigarMutation();
    const [colDefs, setColDefs] = useState([
        { field: "name", header: "Name"},
        { field: "blend", header: "Blend"},
        { field: "size", header: "Size"},
        { field: "price", header: "Price"},
        { field: "quantity", header: "Quantity"},
    ])

    useEffect(() => {
        if (isSuccess) setCigars(data);
    }, [isSuccess, data]);

    const isPositiveInteger = (val) => {
        let str = String(val);

        str = str.trim();

        if (!str) {
            return false;
        }

        str = str.replace(/^0+/, '') || '0';
        let n = Math.floor(Number(str));

        return n !== Infinity && String(n) === str && n >= 0;
    };
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };
    const priceEditor = (options) => {
        return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
    };
    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
    };
    const onRowEditComplete = (e) => {
        let _cigars = [...cigars];
        let { newData, index } = e;

        _cigars[index] = newData;

        setCigars(_cigars);
    };
    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };
    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case 'quantity':
            case 'price':
                if (isPositiveInteger(newValue)) rowData[field] = newValue;
                else event.preventDefault();
                break;

            default:
                if (newValue.trim().length > 0) rowData[field] = newValue;
                else event.preventDefault();
                break;
        }
    }
    const cellEditor = (options) => {
        if (options.field === 'price') return priceEditor(options);
        else return textEditor(options);
    };
    

    if (isLoading) return <PulseLoader color="#CCC" />;
    if (isError) return <p>{error}</p>;

    if (isSuccess) {
        console.log("data")
        console.log(data)
        return (
            <div>
                <h2>Inventory</h2>
                <DataTable value={data} editMode="cell" dataKey="_id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    {/*<Column field="name" header="Name" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="blend" header="Blend" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                    <Column field="size" header="Size" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: '10%' }}></Column>
                    <Column field="quantity" header="Quantity" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>*/}
                    {colDefs.map(({ field, header }) => (
                        <Column key={field} field={field} header={header} 
                        style={{ width: '20%' }} body={field === 'price' && priceBodyTemplate} 
                        editor={(options) => cellEditor(options)} 
                        onCellEditComplete={onCellEditComplete} />
                    ))}
                    {/*<Column headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>*/}
                    {/*<Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>*/}
                </DataTable>
            </div>
        )
    }
}

export default Inventory