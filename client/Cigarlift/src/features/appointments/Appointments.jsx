import { useState } from 'react';
import { useAddNewAppointmentMutation, useGetAppointmentsQuery } from './appointmentApiSlice'
import PulseLoader from 'react-spinners/PulseLoader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useSelector } from "react-redux"
import { selectClient } from '../order/orderSlice';

dayjs.extend(utc);
dayjs.extend(timezone);
//dayjs.tz.setDefault("America/Los_Angeles")

function Appointments() {

    const { data, isLoading, isError, error, isSuccess } = useGetAppointmentsQuery()
    const [dateTime, setDateTime] = useState(dayjs(Date.now()))
    const client = useSelector(selectClient)
    const [addNewAppointment] = useAddNewAppointmentMutation()
    const handleSubmit = async () => {
        const response = await addNewAppointment({client, date: dateTime, notes: "Notes1"})
        console.log(response)
    }

    let content

    if (isLoading) content = <PulseLoader color="#CCC" />;
    if (isError) content = <p>{error.data}</p>;

    if (isSuccess) {
        content = (
            <div>
                {data.map( (a) => (
                    <p key={a._id}>{a.client.dba}: {dayjs(a.date).format("ddd, MMM DD, h:mma")}</p>
                ))}
            </div>
        )
    }

    return (
        <div className='appointments'>
            <h1>Appointments</h1>
            <div className="new-appt">
                <p>{client.dba}</p>
                <LocalizationProvider dateAdapter={AdapterDayjs} timezone="America/Los_Angeles">
                    <DateTimePicker
                    label="Select Date and Time"
                    value={dateTime}
                    onChange={(newValue) => setDateTime(newValue)}
                    />
                </LocalizationProvider>
                <button onClick={handleSubmit}>Add Appointment</button>
            </div>
            {content}
        </div>
    )
}

export default Appointments