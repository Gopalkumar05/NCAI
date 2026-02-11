// const nodemailer = require('nodemailer');
// require('dotenv').config();
// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: `"Flower Shop" <${process.env.EMAIL_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;


const nodemailer = require('nodemailer');
require('dotenv').config();
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Add this for local development
    }
  });

  const mailOptions = {
    from: `"Flower Shop" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message // Accept both html and message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;