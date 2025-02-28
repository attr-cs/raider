const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: true,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: 'Username or email already exists'
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      error: false,
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        credits: user.credits,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error creating user'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        error: true,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      error: false,
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        credits: user.credits,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error during login'
    });
  }
});

// Get user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      error: false,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Error fetching user data'
    });
  }
});

module.exports = router;
