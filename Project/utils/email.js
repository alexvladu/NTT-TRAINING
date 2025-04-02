const nodeMailer=require('nodemailer');

const sendEmail = async options =>{
    // 1 define transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2 define email data
    const mailOptions = {
        from: 'noreply@natours.com', // sender address
        to: options.to, // receiver address
        subject: options.subject, // Subject line
        text: options.message // plain text body
        //html: options.html
    };


    //3 send email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;