const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Get messages for a chat
router.get('/:chatId', authenticateJWT, async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort('createdAt')
      .populate('sender', 'name profilePicture');
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
});

// Send a message (with optional media)
router.post('/:chatId', authenticateJWT, upload.array('media', 5), async (req, res, next) => {
  try {
    const { content } = req.body;
    const mediaUrls = req.files ? req.files.map(file => ({ url: `/uploads/${file.filename}`, type: file.mimetype.split('/')[0], filename: file.originalname })) : [];
    const message = new Message({
      sender: req.user._id,
      chat: req.params.chatId,
      content,
      media: mediaUrls,
      readBy: [req.user._id],
      reactions: []
    });
    await message.save();
    await Chat.findByIdAndUpdate(req.params.chatId, { $push: { messages: message._id } });
    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
