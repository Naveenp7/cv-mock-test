const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private/Admin
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    await question.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Bookmark a question
// @route   POST /api/questions/:id/bookmark
// @access  Private
exports.bookmarkQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if question is already bookmarked
    if (user.bookmarkedQuestions.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Question already bookmarked'
      });
    }

    // Add question to bookmarks
    user.bookmarkedQuestions.push(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.bookmarkedQuestions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove bookmark from question
// @route   DELETE /api/questions/:id/bookmark
// @access  Private
exports.removeBookmark = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if question is bookmarked
    if (!user.bookmarkedQuestions.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Question not bookmarked'
      });
    }

    // Remove question from bookmarks
    user.bookmarkedQuestions = user.bookmarkedQuestions.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.bookmarkedQuestions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookmarked questions
// @route   GET /api/questions/bookmarks
// @access  Private
exports.getBookmarkedQuestions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const bookmarkedQuestions = await Question.find({
      _id: { $in: user.bookmarkedQuestions }
    });

    res.status(200).json({
      success: true,
      count: bookmarkedQuestions.length,
      data: bookmarkedQuestions
    });
  } catch (err) {
    next(err);
  }
}; 