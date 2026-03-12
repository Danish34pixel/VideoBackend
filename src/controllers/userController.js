const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const { fullName, age, mobileNumber, email } = req.body;
    const user = new User({ fullName, age, mobileNumber, email });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, paymentStatus } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { isApproved, paymentStatus },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  approveUser,
};
