const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'metalstation22@gmail.com',
        pass: 'zcwrvqtfpibyfwre'
    }
});

send();

async function send() {
    const result = await transporter.sendMail({
        from: 'metalstation22@gmail.com',
        to: ['officialudaykiran@gmail.com','b182546@rgukt.ac.in','udaycodess@gmail.com'],
        subject: 'Sending Multiple Mails',
        text: 'Testing...'
    });

    console.log(JSON.stringify(result, null, 4));
}