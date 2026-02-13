const Feedback = require('../Models/feedback.Models');
const { sendMail } = require('../utils/mailer');

// ✅ Create Feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, contact, message, rating, feedbackType } = req.body;

    // ✅ Step 1: Validate input
    if (!name || !email || !contact || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, contact, message)"
      });
    }

    // ✅ Step 2: Create feedback entry
    const feedback = await Feedback.create({
      name,
      email,
      contact,
      message,
      rating: rating || 0,
      feedbackType: feedbackType || 'neutral'
    });

    // ✅ Step 3: Send confirmation email to customer
    await sendMail({
      to: email,
      subject: "Thank You for Your Feedback - Xpress Inn Marshall",
      text: `Hello ${name}, thank you for contacting us!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Hello ${name}!</h2>
          <p>Thank you for sharing your feedback with us. We have received your message:</p>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
            <em>"${message}"</em>
          </div>
          <p>We will review your feedback and work on improving your experience.</p>
          <p>If you have any urgent questions, please feel free to contact us directly.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            <strong>Xpress Inn Marshall Team</strong><br>
            300 I-20, Marshall, TX<br>
            Phone: +1 923-471-8277<br>
            Website: https://xpressinnmarshall.com
          </p>
        </div>
      `
    });

    // ✅ Step 4: Send notification to business
    await sendMail({
      to: process.env.BUSINESS_EMAIL,
      subject: `New Feedback from ${name}`,
      text: `New feedback received from ${name} (${email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">New Feedback Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Contact:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${contact}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Rating:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${rating || 'N/A'} ⭐</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Type:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${feedbackType || 'neutral'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background: #f8f9fa;"><strong>Message:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            Received on: ${new Date().toLocaleString('en-US')}
          </p>
        </div>
      `
    });

    // ✅ Step 5: Success response
    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback
    });

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Get All Feedbacks (for admin)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Get Single Feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Update Feedback Status
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

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

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ✅ Delete Feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
