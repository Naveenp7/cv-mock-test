const express = require('express');
const {
  getMyAttempts,
  getAttempt,
  startAttempt,
  submitAnswer,
  markForReview,
  submitAttempt,
  getAnalytics
} = require('../controllers/attempts');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

router
  .route('/')
  .get(getMyAttempts)
  .post(startAttempt);

router.get('/analytics', getAnalytics);

router
  .route('/:id')
  .get(getAttempt);

router.put('/:id/answer', submitAnswer);
router.put('/:id/mark-review', markForReview);
router.put('/:id/submit', submitAttempt);

module.exports = router; 