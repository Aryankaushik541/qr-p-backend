const mongoose = require("mongoose");
const Feedback = require("../Models/feedback.Models");
const { sendMail } = require("../utils/mailer");

/* ======================================================
   ✅ CREATE FEEDBACK (PRODUCTION SAFE)
====================================================== */

exports.createFeedback = async (req, res) => {
  try {
    const { name, email, contact, message, rating, feedbackType } = req.body;

    // Basic safety check (extra layer)
    if (!name || !email || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Save to DB first (MOST IMPORTANT)
    const feedback = await Feedback.create({
      name,
      email,
      contact,
      message,
      rating: rating ?? 0,
      feedbackType: feedbackType ?? "neutral"
    });

    // Send emails in background (NON BLOCKING)
    setImmediate(async () => {
      try {
        await Promise.allSettled([
          sendMail({
            to: email,
            subject: "Thank You for Your Feedback - Xpress Inn Marshall",
            text: `Hello ${name}, thank you for your feedback!`,
            html: `
              <h2>Hello ${name}!</h2>
              <p>We received your message:</p>
              <blockquote>${message}</blockquote>
              <p>We’ll review it shortly.</p>
            `
          }),
          sendMail({
            to: process.env.BUSINESS_EMAIL,
            subject: `New Feedback from ${name}`,
            text: `New feedback received`,
            html: `
              <h3>New Feedback</h3>
              <p><b>Name:</b> ${name}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Contact:</b> ${contact}</p>
              <p><b>Rating:</b> ${rating ?? "N/A"}</p>
              <p><b>Type:</b> ${feedbackType ?? "neutral"}</p>
              <p><b>Message:</b></p>
              <p>${message}</p>
            `
          })
        ]);
      } catch (err) {
        console.error("Background Email Error:", err.message);
      }
    });

    // Immediate response (DO NOT WAIT FOR EMAIL)
    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error) {

    // Validation error
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)[0].message;
      return res.status(400).json({
        success: false,
        message: msg
      });
    }

    console.error("Create Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
