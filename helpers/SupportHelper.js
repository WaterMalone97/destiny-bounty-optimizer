const nodemailer = require('nodemailer');

require('dotenv').config();

class SupportHelper {

    constructor(ctx) {
        this._ctx = ctx;
    }

    async sendEmail(message) {
    
        const transport = {
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.user,
                    pass: process.env.pass
            }  
        }

        const transporter = nodemailer.createTransport(transport)

        transporter.verify((error) => {
            if (error) {
                console.log(error);
            } 
            else {
                console.log('Verified');
            }
        });

        const email = {
            from: message.email,
            to: 'destinybountyoptimizer@gmail.com',  
            subject: message.subject,
            html: "<p>From: " + message.name + "</p>" +
                "<p>Email: " + message.email + "</p>" +
                "<br/><p>Hello DBO Team,</p>" + message.body
        }

        console.log(email)

        transporter.sendMail(email, (err) => {
            if (err) {
                console.log('failed to send')
            } 
            else {
                return email
            }
        })
    }
}

module.exports = SupportHelper;