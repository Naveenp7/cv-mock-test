const User = require('../models/User');
const Attempt = require('../models/Attempt');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Don't allow role to be updated this way
    if (req.body.role) {
      delete req.body.role;
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      college: req.body.college
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    // Get current user's college
    const currentUser = await User.findById(req.user.id);
    
    // Find all users from the same college
    const users = await User.find({ 
      college: currentUser.college 
    }).select('name');

    // Get all completed attempts
    const userIds = users.map(user => user._id);
    
    // Get the latest attempt for each exam by each user
    const attempts = await Attempt.aggregate([
      { 
        $match: { 
          user: { $in: userIds },
          status: 'completed'
        } 
      },
      {
        $sort: { completedAt: -1 }
      },
      {
        $group: {
          _id: { user: '$user', exam: '$exam' },
          latestAttempt: { $first: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestAttempt' }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'exams',
          localField: 'exam',
          foreignField: '_id',
          as: 'examDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $unwind: '$examDetails'
      },
      {
        $project: {
          user: '$userDetails.name',
          exam: '$examDetails.name',
          year: '$examDetails.year',
          score: 1,
          totalQuestions: 1,
          accuracy: {
            $multiply: [
              {
                $cond: [
                  { $eq: [{ $add: ['$correctAnswers', '$incorrectAnswers'] }, 0] },
                  0,
                  { $divide: ['$correctAnswers', { $add: ['$correctAnswers', '$incorrectAnswers'] }] }
                ]
              },
              100
            ]
          },
          completedAt: 1
        }
      },
      {
        $sort: { score: -1, accuracy: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (err) {
    next(err);
  }
}; 