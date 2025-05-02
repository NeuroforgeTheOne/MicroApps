const express = require('express');
const router = express.Router();
const { getUserChats, createChat } = require('../controllers/chats');
const { authenticateJWT } = require('../middleware/auth');

router.get('/', authenticateJWT, getUserChats);
router.post('/', authenticateJWT, createChat);

module.exports = router;
