const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback
} = require("../Controller/feedback.Controllers");

/* ======================================================
   ✅ FEEDBACK ROUTES
====================================================== */

// Create feedback
router.post("/feedback", createFeedback);

// Get all feedbacks
router.get("/feedbacks", getAllFeedbacks);

// Get single feedback
router.get("/feedback/:id", getFeedbackById);

// Update status
router.put("/feedback/:id/status", updateFeedbackStatus);

// Delete feedback
router.delete("/feedback/:id", deleteFeedback);

module.exports = router;
