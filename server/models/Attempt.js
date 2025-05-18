const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      selectedOption: {
        type: Number,
        min: 0,
        max: 3
      },
      isCorrect: {
        type: Boolean,
        default: false
      },
      markedForReview: {
        type: Boolean,
        default: false
      },
      timeSpent: {
        type: Number,
        default: 0 // in seconds
      }
    }
  ],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  unattempted: {
    type: Number,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  topicWiseAnalysis: {
    type: Map,
    of: {
      correct: Number,
      incorrect: Number,
      total: Number,
      accuracy: Number
    }
  }
});

// Calculate score and other metrics before saving
AttemptSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }

  // Calculate metrics
  this.correctAnswers = this.answers.filter(a => a.isCorrect).length;
  this.incorrectAnswers = this.answers.filter(a => a.selectedOption !== undefined && !a.isCorrect).length;
  this.unattempted = this.totalQuestions - this.correctAnswers - this.incorrectAnswers;
  this.score = this.correctAnswers;

  next();
});

module.exports = mongoose.model('Attempt', AttemptSchema); 