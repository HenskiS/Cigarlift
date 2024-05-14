import Marquee from 'react-fast-marquee'
import { useGetUpcomingAppointmentQuery } from '../features/appointments/appointmentApiSlice'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useEffect } from 'react';


dayjs.extend(utc);
dayjs.extend(timezone);

const ApptMarquee = () => {

    const { 
        data, isSuccess, isError, error, isLoading, refetch
    } = useGetUpcomingAppointmentQuery(undefined, {
        pollingInterval: 10000
    })

    // need to have undefined in query above, b/c pollingInterval has to be second param
    /*useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [refetch])*/

    let content = null
    
    if (isLoading || isError) content = null

    else if (isSuccess && data) {
        if (data.none) {
            //console.log(data.none)
            return null
        }
        let time = dayjs(data.date).format("h:mma")//.format("ddd, MMM DD, h:mma")
        let message = `You have an upcoming appointment with ${data.client.dba} at ${time}`
        content = (
            <div className='marquee'>
                <Marquee 
                    autoFill
                    pauseOnClick
                    speed={40}
                >
                    <p style={{ padding: "0px 5px" }}>{message}</p>
                </Marquee>
            </div>
        )
    }

    return content
}

export default ApptMarquee