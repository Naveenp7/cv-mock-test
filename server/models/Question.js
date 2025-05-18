const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  exam: {
    type: String,
    required: [true, 'Please specify the exam'],
    default: 'CV'
  },
  year: {
    type: String,
    required: [true, 'Please specify the year or subject unit']
  },
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Please add options'],
    validate: {
      validator: function(v) {
        return v.length === 4;
      },
      message: 'Each question must have exactly 4 options'
    }
  },
  correct: {
    type: Number,
    required: [true, 'Please specify the correct answer index'],
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topic: {
    type: String,
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema); 