require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("../Routes/feedback.Routes");

const app = express();

/* ======================================================
   ✅ CORS (SAFE & CLEAN)
====================================================== */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://warm-donut.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
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
   ✅ EXPORT
====================================================== */

module.exports = app;
