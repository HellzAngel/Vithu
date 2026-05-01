const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Use Ethereal or log to console if no SMTP credentials are provided
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log("-----------------------------------------");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log("-----------------------------------------");
    return;
  }

  console.log(`📧 Attempting to send email via ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT || 587}...`);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000, // 15 seconds
    family: 4, // Force IPv4
    tls: {
      rejectUnauthorized: false // Helps with some cloud hosting certificate issues
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
