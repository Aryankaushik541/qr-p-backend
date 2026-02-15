const nodemailer = require("nodemailer");

/* ======================================================
   ✅ SEND MAIL FUNCTION (Stable Gmail SSL Config)
====================================================== */

exports.sendMail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error("Recipient email is required");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // 🔥 Use SSL directly (more reliable than 587)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password only
      },
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });

    // ✅ Optional but recommended verification
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
