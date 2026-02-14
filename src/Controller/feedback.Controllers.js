const Feedback = require("../Models/feedback.Models");
const { sendMail } = require("../utils/mailer");
const connectDB = require("../lib/db");

// ✅ Create Feedback
exports.createFeedback = async (req, res) => {
  try {
    await connectDB(); // 🔥 Ensure DB connected before query

    const { name, email, contact, message, rating, feedbackType } = req.body;

    // Validate input
    if (!name || !email || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, contact, message)",
      });
    }

    // Create feedback entry
    const feedback = await Feedback.create({
      name,
      email,
      contact,
      message,
      rating: rating || 0,
      feedbackType: feedbackType || "neutral",
    });

    /* ===============================
       SEND EMAILS (Non-blocking safe)
    ================================ */

    try {
      await sendMail({
        to: email,
        subject: "Thank You for Your Feedback - Xpress Inn Marshall",
        text: `Hello ${name}, thank you for contacting us!`,
        html: `<p>Hello ${name}, thank you for your feedback!</p>`,
      });

      await sendMail({
        to: process.env.BUSINESS_EMAIL,
        subject: `New Feedback from ${name}`,
        text: `New feedback from ${name} (${email})`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`,
      });
    } catch (mailError) {
      console.error("Email Error:", mailError);
      // We do NOT fail the request if email fails
    }

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });

  } catch (error) {
    console.error("Create Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Get All Feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    await connectDB();

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });

  } catch (error) {
    console.error("Get All Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Get Single Feedback
exports.getFeedbackById = async (req, res) => {
  try {
    await connectDB();

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback,
    });

  } catch (error) {
    console.error("Get Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Update Feedback Status
exports.updateFeedbackStatus = async (req, res) => {
  try {
    await connectDB();

    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback,
    });

  } catch (error) {
    console.error("Update Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Delete Feedback
exports.deleteFeedback = async (req, res) => {
  try {
    await connectDB();

    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });

  } catch (error) {
    console.error("Delete Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
