const express = require('express');
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bookmarkQuestion,
  removeBookmark,
  getBookmarkedQuestions
} = require('../controllers/questions');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin'), getQuestions)
  .post(protect, authorize('admin'), createQuestion);

router
  .route('/:id')
  .get(protect, getQuestion)
  .put(protect, authorize('admin'), updateQuestion)
  .delete(protect, authorize('admin'), deleteQuestion);

router.route('/:id/bookmark')
  .post(protect, bookmarkQuestion)
  .delete(protect, removeBookmark);

router.get('/bookmarks', protect, getBookmarkedQuestions);

module.exports = router; 