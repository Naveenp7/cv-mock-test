const express = require('express');
const {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  addQuestion,
  removeQuestion
} = require('../controllers/exams');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getExams)
  .post(protect, authorize('admin'), createExam);

router
  .route('/:id')
  .get(protect, getExam)
  .put(protect, authorize('admin'), updateExam)
  .delete(protect, authorize('admin'), deleteExam);

router
  .route('/:id/questions')
  .post(protect, authorize('admin'), addQuestion);

router
  .route('/:id/questions/:questionId')
  .delete(protect, authorize('admin'), removeQuestion);

module.exports = router; 