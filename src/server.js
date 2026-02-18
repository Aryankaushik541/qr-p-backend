require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("./Routes/feedback.Routes");

const app = express();

/* ======================================================
   ✅ CORS (SAFE & CLEAN)
====================================================== */

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "https://warm-donut.vercel.app"
      ];
      
      // Allow all origins in development (you can remove this in production)
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ======================================================
   ✅ BODY PARSER
====================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   ✅ SERVERLESS SAFE DB CONNECTION
====================================================== */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

/* ======================================================
   ✅ ROUTES
====================================================== */

app.use("/api", feedbackRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "API Running" });
});

/* ======================================================
   ✅ TEST EMAIL ENDPOINT
====================================================== */

app.get("/test-email", async (req, res) => {
  try {
    const { sendMail } = require("./utils/mailer");
    
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        success: false,
        message: "Email configuration missing. Please check .env file."
      });
    }

    // Send test email to the configured email address
    const result = await sendMail({
      to: process.env.EMAIL_USER,
      subject: "Test Email - QR P Backend",
      text: "This is a test email from your QR P Backend server.",
      html: `
        <h2>Test Email Successful! ✅</h2>
        <p>Your email configuration is working correctly.</p>
        <hr/>
        <small>Sent from QR P Backend</small>
      `
    });

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully!",
      messageId: result.messageId
    });

  } catch (error) {
    console.error("❌ Test email failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Test email failed: " + error.message
    });
  }
});

/* ======================================================
   ✅ ERROR HANDLING MIDDLEWARE
====================================================== */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

/* ======================================================
   ✅ EXPORT
====================================================== */

module.exports = app;
