require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const feedbackRoutes = require('./Routes/feedback.Routes');

const app = express();

// ✅ CORS - Frontend ke liye specific
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Other Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Xpress Inn Feedback API is running!");
});

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.log("\n🔍 Troubleshooting tips:");
    console.log("1. Check your internet connection");
    console.log("2. Verify MongoDB Atlas credentials");
    console.log("3. Check if IP is whitelisted in MongoDB Atlas");
    console.log("4. Try using local MongoDB: mongodb://localhost:27017/xpress-inn-feedback");
    console.log("\n⚠️  Server will continue running without database...\n");
  }
};

connectDB();

// ✅ Routes
app.use('/api', feedbackRoutes);

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
