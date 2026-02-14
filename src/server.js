require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("./Routes/feedback.Routes");

const app = express();

/* =====================================================
   ✅ CORS CONFIGURATION (Production + Local Support)
===================================================== */

const allowedOrigins = [
  "http://localhost:3000",              // Local React dev
  "https://warm-donut.vercel.app"       // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =====================================================
   ✅ MIDDLEWARES
===================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   ✅ HEALTH CHECK ROUTE
===================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Xpress Inn Feedback API is running!",
  });
});

/* =====================================================
   ✅ MONGODB CONNECTION
===================================================== */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("🟢 MongoDB Connected");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop server if DB fails (production safe)
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("🟡 MongoDB Disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log("🔴 MongoDB Error:", err);
});

connectDB();

/* =====================================================
   ✅ ROUTES
===================================================== */

app.use("/api", feedbackRoutes);

/* =====================================================
   ✅ 404 HANDLER
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =====================================================
   ✅ START SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
