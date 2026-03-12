const express = require('express');
const { createUser, getUsers, approveUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.put('/approve/:id', approveUser);

module.exports = router;
