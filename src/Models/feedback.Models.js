const mongoose = require("mongoose");

/* ======================================================
   ✅ FEEDBACK SCHEMA
====================================================== */

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
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      ]
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [
        /^[0-9+\-() ]{7,20}$/,
        "Please enter a valid contact number"
      ]
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
      min: [0, "Rating cannot be below 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0
    },

    feedbackType: {
      type: String,
      enum: {
        values: ["happy", "sad", "neutral"],
        message: "Feedback type must be happy, sad, or neutral"
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
    versionKey: false, // removes __v
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

/* ======================================================
   ✅ INDEXES (Better Admin Performance)
====================================================== */

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ status: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
