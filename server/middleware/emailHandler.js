const nodemailer = require("nodemailer")
require('dotenv').config()
const fs = require('fs');

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
var options = {
    convertTo : 'pdf'
};

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

const sendEmail = (order) => {
    console.log("----SEND EMAIL----")

    let cc = ["henryschreiner@mac.com"]
    if (order.client.email && order.client.email !== "") {
        cc.push(order.client.email)
    }
    if (order.emails && order.emails.length > 0) {
        cc.push.apply(cc, order.emails)
    }

    const data = 
    {
        "from": "Cigarlift <cigarliftapp@gmail.com>",
        "to": cc[0], //"henryschreiner@mac.com",
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

module.exports = sendEmail