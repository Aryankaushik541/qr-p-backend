const nodemailer = require('nodemailer');

// ✅ Create transporter with complete configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// ✅ Send email function
exports.sendMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 Email sent to:', to);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    throw error;
  }
};
