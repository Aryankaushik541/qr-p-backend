const nodemailer = require("nodemailer");

/* ======================================================
   ✅ CREATE TRANSPORTER (GMAIL - APP PASSWORD REQUIRED)
====================================================== */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/* ======================================================
   ✅ VERIFY TRANSPORTER (ONLY IN DEV)
====================================================== */

if (process.env.NODE_ENV !== "production") {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email configuration error:", error.message);
    } else {
      console.log("✅ Email server is ready to send messages");
    }
  });
}

/* ======================================================
   ✅ SEND MAIL FUNCTION
====================================================== */

exports.sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    const mailOptions = {
      from: `"Xpress Inn Marshall" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
