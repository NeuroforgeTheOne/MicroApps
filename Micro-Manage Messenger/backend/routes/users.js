const express = require('express');
const router = express.Router();
const { getAllUsers, getProfile, updateProfile } = require('../controllers/users');
const { authenticateJWT } = require('../middleware/auth');

router.get('/', authenticateJWT, getAllUsers);
router.get('/me', authenticateJWT, getProfile);
router.put('/me', authenticateJWT, updateProfile);

module.exports = router;
