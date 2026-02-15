require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("./Routes/feedback.Routes");

const app = express();

/* ======================================================
   ✅ ROBUST CORS CONFIG (NO 403 PRELIGHT)
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://warm-donut.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {

    // Allow Postman / server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(null, false); // DO NOT throw error
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // important

/* ======================================================
   ✅ BODY PARSER
====================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   ✅ TEST ROUTE
====================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Xpress Inn Feedback API Running"
  });
});

/* ======================================================
   ✅ SERVERLESS SAFE DATABASE CONNECTION
====================================================== */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
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

/* ======================================================
   ✅ 404 HANDLER
====================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ======================================================
   ✅ EXPORT (VERCEL)
====================================================== */

module.exports = app;
