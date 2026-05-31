import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockUsers } from '../config/mockData.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // If running in Mock DB Mode
    if (process.env.USE_MOCK_DB === 'true') {
      const user = mockUsers.find((u) => u.email === email);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.role !== role) {
        return res.status(401).json({
          success: false,
          message: `Account found, but role does not match requested role '${role}'`,
        });
      }

      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialization: user.specialization || '',
        },
        token: generateToken(user._id),
      });
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if the requested role matches the user's role
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Account found, but role does not match requested role '${role}'`,
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (process.env.USE_MOCK_DB === 'true') {
      const user = mockUsers.find((u) => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialization: user.specialization || '',
        },
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
