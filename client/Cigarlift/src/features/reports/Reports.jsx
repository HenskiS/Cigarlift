import React from 'react'
import { useGetReportByIdQuery } from './reportsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

const Reports = () => {
    const navigate = useNavigate()

    const { data: report, isLoading, 
            isSuccess, isError, error
    } = useGetReportByIdQuery("20240514")

    let content
    if (isLoading) content = <PulseLoader color={"#CCC"} />
    if (isError) content = <p>{error.data.message}</p>
    if (isSuccess) {
        console.log(report)
        const { stops, orders, sales, appts } = report
        content = (
            <div className="report">
                <h4>Stops</h4>
                {stops.length? stops.map(stop => (
                    <>
                        <p>{stop.dba}</p>
                        <p>{stop.taxpayer}</p>
                    </>
                )) : <p><i>No stops made...</i></p>}
                <h4>Orders</h4>
                {orders.length? orders.map(order => (
                    <a key={order._id} href={"/order/"+order._id}>
                        <p>${order.total.toFixed(2)} - {order.client.dba}</p>
                    </a>
                )) : <p><i>No orders made...</i></p>}
                <h4>Appointments Added</h4>
                {appts.length? appts.map( (a) => (
                    <div key={a._id}> {/* className='appt-card'>*/}
                        <p>{dayjs(a.date).format("ddd, MMM DD, h:mma")}: {a.client.dba}</p>
                        <p className='notes'>{a.notes}</p>
                    </div>
                )) : <p><i>No appointments made...</i></p>}
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
            <h3>Reports</h3>
            {content}
        </div>
    )
}

export default Reports