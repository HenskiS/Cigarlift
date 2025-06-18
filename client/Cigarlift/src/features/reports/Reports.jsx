import { useState } from 'react'
import { useGetReportByIdQuery } from './reportsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

const Reports = () => {
    const [date, setDate] = useState(dayjs())

    const { data: report, isLoading, 
            isSuccess, isError, error
    } = useGetReportByIdQuery(date.format('YYYYMMDD'))

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />
    if (isError) content = <p>{error.data.message}</p>
    if (isSuccess) {
        console.log(report)
        const { orders, sales } = report
        console.log(orders)
        content = (
            <div className="report">
                <LocalizationProvider dateAdapter={AdapterDayjs} timezone="America/Los_Angeles">
                    <DatePicker value={date} onChange={(newValue)=>setDate(newValue)}/>
                </LocalizationProvider>
                <h4>Orders</h4>
                {orders.length? orders.map(order => (
                    <Link key={order._id} to={`/order/${order._id}`}>
                        <p>{order.isTestOrder? 'TEST - ' : ''}${order.total.toFixed(2)} - {order.client.dba}</p>
                    </Link>
                )) : <p><i>No orders made...</i></p>}
                <h4>Sales</h4>
                <p>Total Sales: ${sales.totalCharged.toFixed(2)}</p>
                <p>Total Payed: ${sales.totalPayed.toFixed(2)}</p>
                <p>Cash: ${sales.totalCashPayed.toFixed(2)}, Check: ${sales.totalCheckPayed.toFixed(2)}, Money Order: ${sales.totalMOPayed.toFixed(2)}</p>
                <p>Total Cigars: {sales.totalCigars}</p>
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