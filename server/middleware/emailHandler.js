const nodemailer = require("nodemailer")
require('dotenv').config()
const fs = require('fs');
const Config = require("../models/Config");
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc);
dayjs.extend(timezone);

const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "cigarliftapp@gmail.com",
        pass: process.env.EMAIL_PASS
    }
}

const send = (data) => {
    const transporter = nodemailer.createTransport(config)
    transporter.sendMail(data, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            return info.response
        }
    })
}

const sendApptEmail = async (appt) => {
    console.log("----SEND APPT EMAIL----")

    let config = await Config.findOne({ })
    let cc = config.emails ?? ["henryschreiner@mac.com"]

    let text = `Appointment added for ${appt.client.dba} on ${dayjs.tz(appt.date, 'America/Los_Angeles').format("ddd, MMM DD, h:mma")}`
    if (appt.notes) text = text + `\nNotes: ${appt.notes}`
    const data = 
    {
        "from": "Cigarlift <cigarliftapp@gmail.com>",
        "to": cc[0],
        "cc": cc.slice(1),
        "subject": `Appointment added, ${appt.client.dba}`,
        "text": text,
    }
    send(data)
}

const sendEmail = async (order) => {
    console.log("----SEND EMAIL----")

    let config = await Config.findOne({ })
    let cc = config.emails ?? ["henryschreiner@mac.com"]
    if (order.client.email && order.client.email !== "") {
        cc.push(order.client.email)
    }
    if (order.emails && order.emails.length > 0) {
        cc.push.apply(cc, order.emails)
    }

    const data = 
    {
        "from": "Cigarlift <cigarliftapp@gmail.com>",
        "to": cc[0],
        "cc": cc.slice(1),
        "subject": `Order for ${order.client.dba}`,
        "text": "Attached is a PDF of your order.",
        "attachments": [
        {
            "filename": `${order.filename}`,
            "path": `./orders/${order.filename}`
        }
        ]
    }
    send(data)
}

module.exports.sendEmail = sendEmail
module.exports.sendApptEmail = sendApptEmail