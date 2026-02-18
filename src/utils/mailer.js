const nodemailer = require("nodemailer");

/* ======================================================
   ✅ SEND MAIL FUNCTION (Improved with better error handling)
====================================================== */

exports.sendMail = async ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error("Recipient email is required");
  }

  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ Email configuration missing: EMAIL_USER or EMAIL_PASS not set");
    throw new Error("Email configuration is missing. Please check .env file.");
  }

  try {
    console.log("📧 Attempting to send email to:", to);
    console.log("📧 Using email account:", process.env.EMAIL_USER);

    // Create transporter with improved configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 30000,
      socketTimeout: 30000,
    });

    // Skip verification to avoid network issues on startup
    // The first send will verify automatically if needed
    
    const info = await transporter.sendMail({
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log("✅ Email sent successfully!");
    console.log("✅ Message ID:", info.messageId);
    console.log("✅ To:", to);
    
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    
    if (error.code === 'ECONNECTION') {
      console.error("❌ Connection error - check network or firewall");
    }
    if (error.code === 'EAUTH') {
      console.error("❌ Authentication error - check EMAIL_USER and EMAIL_PASS");
    }
    if (error.code === 'ENOTFOUND') {
      console.error("❌ DNS error - check SMTP host configuration");
    }
    
    throw error;
  }
};

/* ======================================================
   ✅ VERIFY EMAIL CONNECTION (Optional - for testing)
====================================================== */

exports.verifyConnection = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ Email server connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error.message);
    return false;
  }
};
