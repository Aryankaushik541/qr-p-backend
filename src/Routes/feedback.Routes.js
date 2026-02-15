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

/**
 * @route   POST /api/feedback
 * @desc    Create new feedback
 */
router.post("/feedback", createFeedback);

/**
 * @route   GET /api/feedbacks
 * @desc    Get all feedbacks (Admin)
 */
router.get("/feedbacks", getAllFeedbacks);

/**
 * @route   GET /api/feedback/:id
 * @desc    Get single feedback by ID
 */
router.get("/feedback/:id", getFeedbackById);

/**
 * @route   PUT /api/feedback/:id/status
 * @desc    Update feedback status
 */
router.put("/feedback/:id/status", updateFeedbackStatus);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete feedback
 */
router.delete("/feedback/:id", deleteFeedback);

module.exports = router;
