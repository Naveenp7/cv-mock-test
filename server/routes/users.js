const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  updatePassword,
  getLeaderboard
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

// Routes for current user
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.get('/leaderboard', getLeaderboard);

// Admin routes
router
  .route('/')
  .get(authorize('admin'), getUsers);

router
  .route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router; 