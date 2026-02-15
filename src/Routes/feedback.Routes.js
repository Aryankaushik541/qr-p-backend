const express = require('express');
const router = express.Router();
const { 
  createFeedback, 
  getAllFeedbacks, 
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback 
} = require('../Controller/feedback.Controllers');

// ✅ Create new feedback
router.post('/feedback', createFeedback);

// ✅ Get all feedbacks (admin)
router.get('/feedbacks', getAllFeedbacks);

// ✅ Get single feedback by ID
router.get('/feedback/:id', getFeedbackById);

// ✅ Update feedback status
router.put('/feedback/:id/status', updateFeedbackStatus);

// ✅ Delete feedback
router.delete('/feedback/:id', deleteFeedback);

module.exports = router;
