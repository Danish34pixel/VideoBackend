const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const signup = async (req, res) => {
  try {
    console.log('Signup Attempt Body:', req.body);
    const { fullName, age, mobileNumber, email, password } = req.body;
    let role = req.body.role || 'user';

    // Hardcode danishkhaannn34@gmail.com as admin
    if (email.toLowerCase() === 'danishkhaannn34@gmail.com') {
      role = 'admin';
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      age,
      mobileNumber,
      email,
      password,
      role,
      isApproved: role === 'admin' ? true : false,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      paymentStatus: user.paymentStatus,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(400).json({ message: error.message, details: error.errors });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      // Ensure specific email gets admin role even if already signed up as user
      if (email.toLowerCase() === 'danishkhaannn34@gmail.com' && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        paymentStatus: user.paymentStatus,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };
