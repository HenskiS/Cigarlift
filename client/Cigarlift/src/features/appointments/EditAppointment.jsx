import {useState} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const EditAppointment = ({ appt, close }) => {

    const [client, setClient] = useState(appt.client)
    const [date, setDate] = useState(dayjs(appt.date))
    const [notes, setNotes] = useState(appt.notes)

    return (
        <Dialog
            open
            onClose={close}
        >
            <DialogTitle>Edit Appointment</DialogTitle>
            <div className='edit-appt'>

                <LocalizationProvider dateAdapter={AdapterDayjs} timezone="America/Los_Angeles">
                    <DateTimePicker
                    label="Date and Time"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    />
                </LocalizationProvider>
                <label htmlFor="notes">Notes</label>
                <textarea id='notes' value={notes} onChange={e => setNotes(e.target.value)}/>
                
               
            </div>
        </Dialog>
    )
}

export default EditAppointment