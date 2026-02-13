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
  res.json({
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

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected successfully");
    console.log(`📊 Database Name: ${mongoose.connection.name}`);
    console.log(`🔗 Database Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.log("\n🔍 Make sure MongoDB is running:");
    console.log("   - Install MongoDB Compass: https://www.mongodb.com/try/download/compass");
    console.log("   - Or start MongoDB service:");
    console.log("     Windows: net start MongoDB");
    console.log("     Mac: brew services start mongodb-community");
    console.log("     Linux: sudo systemctl start mongod");
    console.log("\n⚠️  Server will continue running without database...\n");
  }
};

// ✅ Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

connectDB();

// ✅ Routes
app.use('/api', feedbackRoutes);

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI}\n`);
});
