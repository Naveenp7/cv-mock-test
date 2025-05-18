const Attempt = require('../models/Attempt');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Get all attempts for current user
// @route   GET /api/attempts
// @access  Private
exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id })
      .populate('exam', 'name year description')
      .sort('-startedAt');

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single attempt
// @route   GET /api/attempts/:id
// @access  Private
exports.getAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('exam')
      .populate('answers.question');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: 'Attempt not found'
      });
    }

    // Make sure user owns attempt
    if (attempt.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this attempt'
      });
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Start new attempt
// @route   POST /api/attempts
// @access  Private
exports.startAttempt = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const { examId } = req.body;

    // Check if exam exists
    const exam = await Exam.findById(examId).populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    // Create attempt
    const attempt = await Attempt.create({
      user: req.user.id,
      exam: examId,
      totalQuestions: exam.totalQuestions,
      answers: exam.questions.map(question => ({
        question: question._id
      }))
    });

    res.status(201).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit answer for a question in an attempt
// @route   PUT /api/attempts/:id/answer
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption } = req.body;

    // Find attempt
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: 'Attempt not found'
      });
    }

    // Make sure user owns attempt
    if (attempt.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this attempt'
      });
    }

    // Check if attempt is already completed
    if (attempt.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update a completed attempt'
      });
    }

    // Find question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    // Find answer in attempt
    const answerIndex = attempt.answers.findIndex(
      answer => answer.question.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Question not found in this attempt'
      });
    }

    // Update answer
    attempt.answers[answerIndex].selectedOption = selectedOption;
    attempt.answers[answerIndex].isCorrect = selectedOption === question.correct;
    
    // Save attempt
    await attempt.save();

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark question for review
// @route   PUT /api/attempts/:id/mark-review
// @access  Private
exports.markForReview = async (req, res, next) => {
  try {
    const { questionId, markedForReview } = req.body;

    // Find attempt
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: 'Attempt not found'
      });
    }

    // Make sure user owns attempt
    if (attempt.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this attempt'
      });
    }

    // Check if attempt is already completed
    if (attempt.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update a completed attempt'
      });
    }

    // Find answer in attempt
    const answerIndex = attempt.answers.findIndex(
      answer => answer.question.toString() === questionId
    );

    if (answerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Question not found in this attempt'
      });
    }

    // Update marked for review status
    attempt.answers[answerIndex].markedForReview = markedForReview;
    
    // Save attempt
    await attempt.save();

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit attempt (complete test)
// @route   PUT /api/attempts/:id/submit
// @access  Private
exports.submitAttempt = async (req, res, next) => {
  try {
    // Find attempt
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        error: 'Attempt not found'
      });
    }

    // Make sure user owns attempt
    if (attempt.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to submit this attempt'
      });
    }

    // Check if attempt is already completed
    if (attempt.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'This attempt is already completed'
      });
    }

    // Update attempt status
    attempt.status = 'completed';
    attempt.timeTaken = req.body.timeTaken || 0;
    attempt.completedAt = Date.now();

    // Calculate topic-wise analysis
    const questionIds = attempt.answers.map(answer => answer.question);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const topicAnalysis = {};

    // Initialize topic analysis
    questions.forEach(question => {
      if (!topicAnalysis[question.topic]) {
        topicAnalysis[question.topic] = {
          correct: 0,
          incorrect: 0,
          total: 0,
          accuracy: 0
        };
      }
    });

    // Calculate topic-wise stats
    attempt.answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.question.toString());
      
      if (question) {
        const topic = question.topic;
        topicAnalysis[topic].total += 1;
        
        if (answer.selectedOption !== undefined) {
          if (answer.isCorrect) {
            topicAnalysis[topic].correct += 1;
          } else {
            topicAnalysis[topic].incorrect += 1;
          }
        }
      }
    });

    // Calculate accuracy
    Object.keys(topicAnalysis).forEach(topic => {
      const attempted = topicAnalysis[topic].correct + topicAnalysis[topic].incorrect;
      topicAnalysis[topic].accuracy = attempted > 0 
        ? (topicAnalysis[topic].correct / attempted) * 100 
        : 0;
    });

    attempt.topicWiseAnalysis = topicAnalysis;
    
    // Save attempt
    await attempt.save();

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get performance analytics for a user
// @route   GET /api/attempts/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ 
      user: req.user.id,
      status: 'completed'
    }).populate('exam', 'name year');

    // Calculate overall stats
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts 
      : 0;
    const averageAccuracy = totalAttempts > 0
      ? attempts.reduce((sum, attempt) => {
          const attempted = attempt.correctAnswers + attempt.incorrectAnswers;
          return sum + (attempted > 0 ? (attempt.correctAnswers / attempted) * 100 : 0);
        }, 0) / totalAttempts
      : 0;

    // Prepare attempt history
    const attemptHistory = attempts.map(attempt => ({
      id: attempt._id,
      examName: attempt.exam.name,
      examYear: attempt.exam.year,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      accuracy: attempt.correctAnswers / (attempt.correctAnswers + attempt.incorrectAnswers) * 100,
      date: attempt.completedAt
    }));

    // Get topic-wise performance
    const topicPerformance = {};

    attempts.forEach(attempt => {
      if (attempt.topicWiseAnalysis) {
        for (const [topic, stats] of Object.entries(attempt.topicWiseAnalysis.toJSON())) {
          if (!topicPerformance[topic]) {
            topicPerformance[topic] = {
              correct: 0,
              incorrect: 0,
              total: 0,
              attempts: 0
            };
          }
          
          topicPerformance[topic].correct += stats.correct;
          topicPerformance[topic].incorrect += stats.incorrect;
          topicPerformance[topic].total += stats.total;
          topicPerformance[topic].attempts += 1;
        }
      }
    });

    // Calculate topic accuracy
    Object.keys(topicPerformance).forEach(topic => {
      const attempted = topicPerformance[topic].correct + topicPerformance[topic].incorrect;
      topicPerformance[topic].accuracy = attempted > 0 
        ? (topicPerformance[topic].correct / attempted) * 100 
        : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore,
        averageAccuracy,
        attemptHistory,
        topicPerformance
      }
    });
  } catch (err) {
    next(err);
  }
}; 