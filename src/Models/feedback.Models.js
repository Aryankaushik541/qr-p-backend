const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },

    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      minlength: 7,
      maxlength: 20
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 5,
      maxlength: 2000
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    feedbackType: {
      type: String,
      enum: ["happy", "sad", "neutral"],
      default: "neutral"
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: true // ensure index builds safely
  }
);

/* ======================================================
   ✅ SAFE MODEL EXPORT (SERVERLESS SAFE)
====================================================== */

module.exports =
  mongoose.models.Feedback ||
  mongoose.model("Feedback", feedbackSchema);
