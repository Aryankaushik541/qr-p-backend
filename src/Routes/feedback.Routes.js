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

// Get all feedbacks (admin)
router.get("/feedbacks", getAllFeedbacks);

// Get single feedback
router.get("/feedback/:id", getFeedbackById);

// Update status
router.put("/feedback/:id/status", updateFeedbackStatus);

// Delete feedback
router.delete("/feedback/:id", deleteFeedback);

/* ======================================================
   ✅ OPTIONAL: HANDLE PREFLIGHT (Extra Safety)
====================================================== */

router.options("*", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
