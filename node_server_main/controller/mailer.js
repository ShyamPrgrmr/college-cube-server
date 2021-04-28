const nodemailer = require('nodemailer');

exports.Mailer=async(receiver,message)=>{

    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", 
        secureConnection: false, 
        port: 587, 
        tls: {
        ciphers:'SSLv3'
        },
        auth: {
            user: 'grocery.shop50@hotmail.com',
            pass: 'Shyam123@@'
        }
    });


    let mailOptions = {
        from: 'grocery.shop50@hotmail.com', 
        to: receiver.email, 
        subject: message.subject, 
        text: message.text, 
        html: message.html
    };


    let data = await transporter.sendMail(mailOptions);
    return data;
}