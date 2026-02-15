const nodemailer = require("nodemailer");

/* ======================================================
   ✅ REUSABLE TRANSPORTER (IMPORTANT FOR SERVERLESS)
====================================================== */

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,                 // connection pooling
      maxConnections: 1,
      maxMessages: 50,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

/* ======================================================
   ✅ SEND MAIL FUNCTION (FAST + SAFE)
====================================================== */

exports.sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!to) throw new Error("Recipient email is required");

    const mailer = getTransporter();

    const info = await mailer.sendMail({
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("✅ Email sent:", info.response);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
