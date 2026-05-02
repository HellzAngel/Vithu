const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Not authorized as an admin' });
  }
};

// @route   GET /api/admin/farmers
// @desc    Get all farmers for approval
// @access  Private/Admin
router.get('/farmers', protect, admin, async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json({ success: true, farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/farmers/:id/approve
// @desc    Approve/Disapprove a farmer
// @access  Private/Admin
router.put('/farmers/:id/approve', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.isApproved = !user.isApproved;
    await user.save();
    
    res.json({ success: true, isApproved: user.isApproved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
