const nodemailer = require("nodemailer");

/* ======================================================
   ✅ SINGLE GLOBAL TRANSPORTER (NO POOL FOR SERVERLESS)
====================================================== */

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use SSL directly (more stable than STARTTLS 587)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
  }
  return transporter;
}

/* ======================================================
   ✅ SEND MAIL FUNCTION
====================================================== */

exports.sendMail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error("Recipient email is required");

  try {
    const mailer = getTransporter();

    const info = await mailer.sendMail({
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("✅ Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
