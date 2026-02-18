require("dotenv").config();
const { sendMail } = require("./src/utils/mailer");

sendMail({
    to: process.env.EMAIL_USER,
    subject: "Testing Email",
    text: "Testing email system"
})
    .then(() => console.log("Mail sent"))
    .catch(err => console.error("Error:", err.message));
