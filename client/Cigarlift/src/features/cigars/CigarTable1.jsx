import React, { useMemo, useState } from 'react'
import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';

function CigarTable({ data }) {
    const [editedUsers, setEditedUsers] = useState([])

    const columns = useMemo( 
        () => [
          {
            accessorKey: 'name',
            header: 'Name',
            size: 100,
            muiEditTextFieldProps: ({ cell, row }) => ({
                type: 'text',
                editComponent: props => (
                    <input
                      type="text"
                      value={props.value}
                      onChange={e => props.onChange(e.target.value)}
                    />
                  )
            }),
          },
          {
            accessorKey: 'blend',
            header: 'Blend',
            size: 100,
            muiEditTextFieldProps: ({ cell, row }) => ({
                type: 'text',
                editComponent: props => (
                    <input
                      type="text"
                      value={props.value}
                      onChange={e => props.onChange(e.target.value)}
                    />
                  )
            }),
          },
          {
            accessorKey: 'size',
            header: 'Size',
            size: 100,
            muiEditTextFieldProps: ({ cell, row }) => ({
                type: 'text',
                editComponent: props => (
                    <input
                      type="text"
                      value={props.value}
                      onChange={e => props.onChange(e.target.value)}
                    />
                  )
            }),
          },
          {
            accessorKey: 'price',
            header: 'Price',
            size: 100,
            muiEditTextFieldProps: ({ cell, row }) => ({
                type: 'text',
                editComponent: props => (
                    <input
                      type="text"
                      value={props.value}
                      onChange={e => props.onChange(e.target.value)}
                    />
                  )
            }),
          },
          {
            accessorKey: 'quantity',
            header: 'Quantity',
            size: 100,
            muiEditTextFieldProps: ({ cell, row }) => ({
                type: 'text',
                editComponent: props => (
                    <input
                      type="text"
                      value={props.value}
                      onChange={e => props.onChange(e.target.value)}
                    />
                  )
            }),
          },
        ],
        [editedUsers],
      );
    
      const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        editDisplayMode: 'cell', // ('modal', 'row', 'table', and 'custom' are also available)
        enableCellActions: true,
        enableColumnPinning: true,
        enableEditing: true,
        getRowId: (row) => row._id,
      });
    
      return (
        <div className='cigar-table'>
            <MaterialReactTable table={table} />
        </div>
      )
}

export default CigarTable