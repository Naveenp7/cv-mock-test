const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
exports.getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find().select('-questions');

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Admin
exports.createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);

    res.status(201).json({
      success: true,
      data: exam
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
exports.updateExam = async (req, res, next) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
exports.deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    await exam.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add question to exam
// @route   POST /api/exams/:id/questions
// @access  Private/Admin
exports.addQuestion = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    const { questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    // Check if question is already in exam
    if (exam.questions.includes(questionId)) {
      return res.status(400).json({
        success: false,
        error: 'Question already in exam'
      });
    }

    exam.questions.push(questionId);
    await exam.save();

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove question from exam
// @route   DELETE /api/exams/:id/questions/:questionId
// @access  Private/Admin
exports.removeQuestion = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    // Check if question is in exam
    if (!exam.questions.includes(req.params.questionId)) {
      return res.status(400).json({
        success: false,
        error: 'Question not in exam'
      });
    }

    exam.questions = exam.questions.filter(
      id => id.toString() !== req.params.questionId
    );
    await exam.save();

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (err) {
    next(err);
  }
}; 