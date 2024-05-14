import { Fragment, useEffect, useState } from 'react'
import { ReactMultiEmail } from 'react-multi-email'
import 'react-multi-email/dist/style.css'
import { useGetConfigQuery, useUpdateConfigMutation } from '../features/drive/itineraryApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'


const EmailSelect = () => {
    const [emails, setEmails] = useState([])
    const [emailsHaveChanged, setEmailsHaveChanged] = useState(false)
    const {data, isSuccess, isLoading, isError, error} = useGetConfigQuery()
    const [updateConfigMutation] = useUpdateConfigMutation()
    
    useEffect(()=>{
        if (isSuccess) setEmails(data.emails)
    }, [isSuccess, data])
    useEffect(()=>{
        if (emailsHaveChanged && emails && isSuccess && emails.length != data?.emails?.length) {
            console.log("Updating emails")
            console.log({...data, emails})
            updateConfigMutation({...data, emails})
        }
    }, [emails])

    let content
    if (isError) content = <p>{JSON.stringify(error.data)}</p>
    if (isLoading) content = <PulseLoader color={"#CCC"} />
    if (isSuccess) content = (
        <ReactMultiEmail 
            placeholder='Input email address(es)'
            emails={emails}
            onChange={(emails) => {setEmailsHaveChanged(true); setEmails(emails);}}
            getLabel={(email, index, removeEmail) => (
                <div data-tag key={index}>
                <div data-tag-item>{email}</div>
                <span data-tag-handle onClick={() => removeEmail(index)}>×</span>
                </div>
            )}
        />
    )

    return (
        <Fragment>
            <h2>Order Recipient Emails</h2>
            <p style={{color: "gray"}}>These email addresses will receive the order PDFs automatically</p>
            {content}
        </Fragment>
    )
}

export default EmailSelect