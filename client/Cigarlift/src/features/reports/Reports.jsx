import { Fragment, useState } from 'react'
import { useGetReportByIdQuery } from './reportsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Order from '../order/Order';

dayjs.extend(utc);
dayjs.extend(timezone);

const Reports = () => {
    const navigate = useNavigate()
    const [date, setDate] = useState(dayjs())
    const [selectedOrderId, setSelectedOrderId] = useState(null)

    const { data: report, isLoading, 
            isSuccess, isError, error
    } = useGetReportByIdQuery(date.format('YYYYMMDD'))

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />
    if (isError) content = <p>{error.data.message}</p>
    if (isSuccess) {
        console.log(report)
        const { stops, orders, sales, appts } = report
        content = (
            <div className="report">
                <LocalizationProvider dateAdapter={AdapterDayjs} timezone="America/Los_Angeles">
                    <DatePicker value={date} onChange={(newValue)=>setDate(newValue)}/>
                </LocalizationProvider>
                {/* <h4>Stops</h4>
                {stops.length? stops.map(stop => (
                    <div className='stopcard' key={stop._id}>
                        <div className='l'>
                            <p>{stop.dba}</p>
                            <p>{stop.taxpayer}</p>
                        </div>
                        <div className="r">
                            <p>{dayjs(stop.visitTime).format('h:mmA')}</p>
                        </div>
                    </div>
                )) : <p><i>No stops made...</i></p>} */}
                <h4>Orders</h4>
                {orders.length? orders.map(order => (
                    <a key={order._id} href={"/order/"+order._id}>
                    {/* <div key={order._id} onClick={()=>setSelectedOrderId(order._id)}> */}
                        <p>{order.isTestOrder? 'TEST - ' : ''}${order.total.toFixed(2)} - {order.client.dba}</p>
                    </a>
                )) : <p><i>No orders made...</i></p>}
                {/* <h4>Appointments Added</h4>
                { appts.length? appts.map( (a) => (
                    <div key={a._id}>
                        <p>{dayjs(a.date).format("ddd, MMM DD, h:mma")}: {a.client.dba}</p>
                        <p className='notes'>{a.notes}</p>
                    </div>
                )) : <p><i>No appointments made...</i></p> */}
                <h4>Sales</h4>
                <p>Total Sales: ${sales.totalCharged.toFixed(2)}</p>
                <p>Total Payed: ${sales.totalPayed.toFixed(2)}</p>
                <p>Cash: ${sales.totalCashPayed.toFixed(2)}, Check: ${sales.totalCheckPayed.toFixed(2)}, Money Order: ${sales.totalMOPayed.toFixed(2)}</p>
                <p>Total Cigars: {sales.totalCigars}</p>
                {/* {selectedOrderId ? 
                    <div style={{ width: '100%', padding: 20, border: '1px solid lightgray'}}>
                        <Order orderId={selectedOrderId} />
                    </div>
                   
                : null} */}
            </div>
        )
}

    return (
        <div className='reports'>
            <h2>Reports</h2>
            {content}
        </div>
    )
}

export default Reports