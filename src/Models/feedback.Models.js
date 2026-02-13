const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true
    },
    contact: { 
      type: String, 
      required: true,
      trim: true
    },
    message: { 
      type: String, 
      required: true 
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    feedbackType: {
      type: String,
      enum: ['happy', 'sad', 'neutral'],
      default: 'neutral'
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending'
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
