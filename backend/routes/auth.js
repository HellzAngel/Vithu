const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user (with OTP for farmers)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, farmName, address, city, pincode, lat, lng } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    const userData = { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      otp, 
      otpExpires,
      location: { 
        address, 
        city, 
        pincode,
        coordinates: { lat, lng }
      },
      isVerified: role === 'customer'
    };
    
    if (role === 'farmer') {
      userData.farmName = farmName;
    }

    const user = await User.create(userData);

    // Send OTP email (don't await so it doesn't block the UI)
    sendEmail({
      email: user.email,
      subject: 'വിത്ത്: Verify your account',
      message: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    }).catch(err => console.error("Email sending failed:", err));

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your OTP.',
      userId: user._id,
      role: user.role
    });
  } catch (error) {
    console.error("Registration error details:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Account verified successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ 
          success: false, 
          message: 'Please verify your email address before logging in.',
          needsVerification: true,
          email: user.email
        });
      }

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route   GET /api/auth/farmers
// @desc    Get all verified/approved farmers for map
// @access  Public
router.get('/farmers', async (req, res) => {
  try {
    const farmers = await User.find({ 
      role: 'farmer', 
      'location.coordinates.lat': { $exists: true, $ne: null } 
    })
      .select('name farmName location.coordinates location.city isApproved');
    res.json({ success: true, farmers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Vithu Password',
      text: `Your OTP for password reset is: ${otp}`
    });

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/auth/report-farmer/:id
// @desc    Report a farmer
// @access  Private
router.post('/report-farmer/:id', protect, async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    
    farmer.reports.push({
      customer: req.user._id,
      reason: req.body.reason
    });
    
    await farmer.save();
    res.json({ success: true, message: 'Farmer reported successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
