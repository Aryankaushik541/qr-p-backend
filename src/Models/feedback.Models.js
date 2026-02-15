const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address"
      ]
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      minlength: [7, "Contact number is too short"],
      maxlength: [20, "Contact number is too long"]
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [5, "Message must be at least 5 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"]
    },

    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0
    },

    feedbackType: {
      type: String,
      enum: {
        values: ["happy", "sad", "neutral"],
        message: "Invalid feedback type"
      },
      default: "neutral"
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "reviewed", "resolved"],
        message: "Invalid status value"
      },
      default: "pending"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

/* ======================================================
   ✅ INDEXES (Important for performance)
====================================================== */

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ email: 1 });

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
