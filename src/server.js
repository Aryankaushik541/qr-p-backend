require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const feedbackRoutes = require("./Routes/feedback.Routes");

const app = express();

/* ======================================================
   ✅ PROPER CORS CONFIG (NO EXTENSION REQUIRED)
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL // production frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests like Postman or server-to-server (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Handle preflight requests
app.options("*", cors());

/* ======================================================
   ✅ BODY PARSERS
====================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   ✅ TEST ROUTE
====================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Xpress Inn Feedback API is running!",
    endpoints: {
      createFeedback: "POST /api/feedback",
      getAllFeedbacks: "GET /api/feedbacks",
      getFeedback: "GET /api/feedback/:id",
      updateStatus: "PUT /api/feedback/:id/status",
      deleteFeedback: "DELETE /api/feedback/:id"
    }
  });
});

/* ======================================================
   ✅ MONGODB CONNECTION
====================================================== */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected successfully");
    console.log(`📊 DB Name: ${mongoose.connection.name}`);
    console.log(`🔗 DB Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1); // Stop server if DB fails (production safe)
  }
};

mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("🔴 Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 Mongoose disconnected from MongoDB");
});

connectDB();

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
   ✅ SERVER START
====================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n🚀 Server started successfully!");
  console.log(`📍 Running on port: ${PORT}`);
});
