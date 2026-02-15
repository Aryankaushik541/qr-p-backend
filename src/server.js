require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const feedbackRoutes = require("./Routes/feedback.Routes");

const app = express();

/* ======================================================
   ✅ HARD CORS FIX (MANUAL HEADERS)
====================================================== */

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ======================================================
   ✅ BODY PARSER
====================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   ✅ DATABASE CONNECTION (SERVERLESS SAFE)
====================================================== */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({
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
   ✅ EXPORT (NO app.listen)
====================================================== */

module.exports = app;
