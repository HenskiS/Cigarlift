const nodemailer = require("nodemailer")
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
const fs = require('fs');
const Config = require("../models/Config");
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc);
dayjs.extend(timezone);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Keep your original Gmail config as backup
const gmailConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "noreply@cigarlift.work",
        pass: process.env.EMAIL_PASS
    }
}

// SendGrid SMTP config (alternative to API)
const sendgridConfig = {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
}

// Use SendGrid API by default, fallback to SMTP
const USE_SENDGRID_API = true;

const send = async (data) => {
    if (USE_SENDGRID_API && process.env.SENDGRID_API_KEY) {
        // Use SendGrid API
        try {
            const msg = {
                to: Array.isArray(data.to) ? data.to : [data.to],
                cc: data.cc || [],
                from: data.from || 'cigarliftapp@gmail.com',
                subject: data.subject,
                text: data.text,
                html: data.html,
                attachments: data.attachments ? data.attachments.map(att => ({
                    content: fs.readFileSync(att.path).toString('base64'),
                    filename: att.filename,
                    type: 'application/pdf', // Adjust based on your file types
                    disposition: 'attachment'
                })) : undefined
            };
            
            const response = await sgMail.send(msg);
            console.log('✅ Email sent via SendGrid API');
            return response;
        } catch (error) {
            console.log('❌ SendGrid API failed:', error.message);
            console.log('Falling back to SMTP...');
            return sendViaSMTP(data);
        }
    } else {
        return sendViaSMTP(data);
    }
}

const sendViaSMTP = (data) => {
    // Try SendGrid SMTP first, then Gmail
    const config = process.env.SENDGRID_API_KEY ? sendgridConfig : gmailConfig;
    const transporter = nodemailer.createTransporter(config);
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(data, (err, info) => {
            if (err) {
                console.log('❌ SMTP Error:', err.message);
                reject(err);
            } else {
                console.log('✅ Email sent via SMTP');
                resolve(info.response);
            }
        });
    });
}

const sendApptEmail = async (appt) => {
    console.log("----SEND APPT EMAIL----")

    let config = await Config.findOne({ })
    let cc = config.emails ?? ["henryschreiner@mac.com"]

    let text = `Appointment added for ${appt.client.dba} on ${dayjs.tz(appt.date, 'America/Los_Angeles').format("ddd, MMM DD, h:mma")}`
    if (appt.notes) text = text + `\nNotes: ${appt.notes}`
    const data = 
    {
        "from": "Cigarlift <noreply@cigarlift.work>",
        "to": cc[0],
        "cc": cc.slice(1),
        "subject": `Appointment added, ${appt.client.dba}`,
        "text": text,
    }
    
    try {
        await send(data);
    } catch (error) {
        console.log('Failed to send appointment email:', error.message);
    }
}

const sendEmail = async (order) => {
    console.log("----SEND EMAIL----")

    let config = await Config.findOne({ })
    let cc = config.emails ?? ["henryschreiner@mac.com"]
    if (!order.isTestOrder && order.client.email && order.client.email !== "") {
        cc.push(order.client.email)
    }
    if (order.emails && order.emails.length > 0) {
        cc.push.apply(cc, order.emails)
    }

    const data = 
    {
        "from": "Cigarlift <noreply@cigarlift.work>",
        "to": cc[0],
        "cc": cc.slice(1),
        "subject": `Order for ${order.client.dba}`,
        "text": `Attached is a PDF of your${order.isTestOrder?' test':''} order.`,
        "attachments": [
            {
                "filename": `${order.filename}`,
                "path": `./orders/${order.filename}`
            }
        ]
    }
    
    try {
        await send(data);
    } catch (error) {
        console.log('Failed to send order email:', error.message);
    }
}

module.exports.sendEmail = sendEmail
module.exports.sendApptEmail = sendApptEmail
