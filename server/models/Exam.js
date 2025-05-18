const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an exam name'],
    default: 'CV'
  },
  year: {
    type: String,
    required: [true, 'Please specify the year or subject unit']
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    required: [true, 'Please specify the duration in minutes'],
    default: 60
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total questions before saving
ExamSchema.pre('save', function(next) {
  this.totalQuestions = this.questions.length;
  next();
});

module.exports = mongoose.model('Exam', ExamSchema); 