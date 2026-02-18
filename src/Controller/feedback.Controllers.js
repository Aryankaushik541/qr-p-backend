const mongoose = require("mongoose");
const Feedback = require("../Models/feedback.Models");
const { sendMail } = require("../utils/mailer");

/* ======================================================
   ✅ CREATE FEEDBACK
====================================================== */

exports.createFeedback = async (req, res) => {
  try {
    const { name, email, contact, message, rating, feedbackType } = req.body;

    // Create feedback (schema handles validation)
    const feedback = await Feedback.create({
      name,
      email,
      contact,
      message,
      rating,
      feedbackType
    });

    /* ======================================================
       SEND EMAILS (WITH PROPER AWAIT)
    ====================================================== */

    console.log("📧 Starting email sending process...");

    // Send email to customer
    try {
      console.log("📧 Sending email to customer:", email);
      const customerMailResult = await sendMail({
        to: email,
        subject: "Thank You for Your Feedback - Xpress Inn Marshall",
        text: `Hello ${name}, thank you for contacting us!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color:#e74c3c;">Hello ${name}!</h2>
            <p>We have received your feedback:</p>
            <blockquote style="background:#f8f9fa;padding:15px;border-left:4px solid #e74c3c;">
              ${message}
            </blockquote>
            <p>Our team will review it shortly.</p>
            <hr/>
            <p style="font-size:14px;color:#666;">
              Xpress Inn Marshall<br/>
              300 I-20, Marshall, TX
            </p>
          </div>
        `
      });
      console.log("✅ Customer email sent successfully!");
    } catch (emailError) {
      console.error("❌ Customer email failed:", emailError.message);
    }

    // Send email to business
    try {
      const businessEmail = process.env.BUSINESS_EMAIL;
      if (!businessEmail) {
        console.warn("⚠️ BUSINESS_EMAIL not set in .env file");
      } else {
        console.log("📧 Sending email to business:", businessEmail);
        const businessMailResult = await sendMail({
          to: businessEmail,
          subject: `New Feedback from ${name}`,
          text: `New feedback from ${name}`,
          html: `
            <h3>New Feedback Received</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Rating:</strong> ${rating ?? "N/A"}</p>
            <p><strong>Type:</strong> ${feedbackType ?? "neutral"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr/>
            <small>${new Date().toLocaleString()}</small>
          `
        });
        console.log("✅ Business email sent successfully!");
      }
    } catch (emailError) {
      console.error("❌ Business email failed:", emailError.message);
    }

    console.log("📧 Email sending process completed");

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error) {

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }

    console.error("Create Feedback Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* ======================================================
   ✅ GET ALL FEEDBACKS
====================================================== */

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });

  } catch (error) {
    console.error("Get All Feedback Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* ======================================================
   ✅ GET FEEDBACK BY ID
====================================================== */

exports.getFeedbackById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback ID"
      });
    }

    const feedback = await Feedback.findById(req.params.id).lean();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error("Get Feedback Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* ======================================================
   ✅ UPDATE FEEDBACK STATUS
====================================================== */

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback
    });

  } catch (error) {
    console.error("Update Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* ======================================================
   ✅ DELETE FEEDBACK
====================================================== */

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });

  } catch (error) {
    console.error("Delete Feedback Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
