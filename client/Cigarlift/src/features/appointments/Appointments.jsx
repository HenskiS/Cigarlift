import { useState } from 'react';
import {useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useAddNewAppointmentMutation, useGetAppointmentsQuery } from './appointmentApiSlice'
import PulseLoader from 'react-spinners/PulseLoader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useSelector } from "react-redux"
import { selectClient, setClient } from '../order/orderSlice';
import EditAppointment from './EditAppointment';

dayjs.extend(utc);
dayjs.extend(timezone);

function Appointments() {

    const { data: appointments, isLoading, isError, error, isSuccess } = useGetAppointmentsQuery()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [dateTime, setDateTime] = useState(dayjs(Date.now()))
    const [notes, setNotes] = useState()
    const [isEditAppt, setIsEditAppt] = useState(false)
    const [editAppt, setEditAppt] = useState()
    const [newClientName, setNewClientName] = useState("")
    const client = useSelector(selectClient)
    const [addNewAppointment] = useAddNewAppointmentMutation()
    const handleSubmit = async () => {
        let response
        if (newClientName) {
            response = await addNewAppointment({client: {dba: newClientName}, date: dateTime, notes})
        } else {
            response = await addNewAppointment({client, date: dateTime, notes})
        }
        if (response.error?.data?.error) alert(response.error.data.error)
        else {
            setNotes("")
            setDateTime(dayjs(Date.now()))
            if (newClientName) {
                dispatch(setClient({dba: newClientName}))
                navigate("/clients/new")
            }
        }
    }

    let content

    if (isLoading) content = <PulseLoader color="#CCC" />;
    if (isError) content = <p style={{color: "gray"}}>{error.data.message}</p>;

    if (isSuccess) {
        const sorted = [...appointments].sort((a,b)=>new Date(a.date) - new Date(b.date))
        content = (
            <div>
                {sorted.map( (a) => (
                    <div key={a._id} className='appt-card'
                        onClick={() => {
                            setEditAppt(a)
                            setIsEditAppt(true)
                        }}
                    >
                        <p>{dayjs(a.date).format("ddd, MMM DD, h:mma")}: {a.client.dba}</p>
                        <p className='notes'>{a.notes}</p>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='appointments'>
            {isEditAppt ? <EditAppointment appt={editAppt} close={()=>setIsEditAppt(false)} /> : null}
            <h1>Appointments</h1>
            <div className="new-appt">
                <div className='new-appt-placetime'>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <p>{client.dba ?? "Select a client..."}</p>
                        <p>-or-</p>
                        <input type="text" className='new-client-input'
                            placeholder='New Client' 
                            value={newClientName}
                            onChange={e => setNewClientName(e.target.value)}
                        />
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} timezone="America/Los_Angeles">
                        <DateTimePicker
                        label="Select Date and Time"
                        value={dateTime}
                        onChange={(newValue) => setDateTime(newValue)}
                        />
                    </LocalizationProvider>
                    
                </div>
                <textarea className='new-appt-notes' value={notes} 
                    placeholder='Appointment notes...' 
                    onChange={e => setNotes(e.target.value)}/>
                    <button className="add-new-appt" onClick={handleSubmit}>Add Appointment</button>
            </div>
            {content}
        </div>
    )
}

export default Appointments