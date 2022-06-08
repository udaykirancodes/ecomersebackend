// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'metalstation22@gmail.com',
//         pass: 'zcwrvqtfpibyfwre'
//     }
// });

// send();
// async function send() {
//     const result = await transporter.sendMail({
//         from: 'metalstation22@gmail.com',
//         to: 'udaycodess@gmail.com',
//         subject: 'Sending Multiple Mails',
//         text: 'Testing...'
//     });

//     console.log(JSON.stringify(result, null, 4));
// }


const mongoose = require('mongoose'); 

console.log(mongoose.isValidObjectId('6yhbgfd45fre')); 