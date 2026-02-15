const nodemailer = require("nodemailer");

/* ======================================================
   ✅ SEND MAIL FUNCTION (Fresh Connection Each Time)
====================================================== */

exports.sendMail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error("Recipient email is required");

  try {
    // ⚠️ Create transporter inside function (serverless safe)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });

    const info = await transporter.sendMail({
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });

    console.log("✅ Email sent:", info.response);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};
