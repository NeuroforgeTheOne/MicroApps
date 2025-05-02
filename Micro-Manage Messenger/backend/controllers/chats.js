const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');

// Get all chats for the current user
exports.getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate('users', 'name profilePicture status')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: 1 }, limit: 50 },
      });
    res.json({ success: true, chats });
  } catch (err) {
    next(err);
  }
};

// Create a new chat (1:1 or group)
exports.createChat = async (req, res, next) => {
  try {
    const { userIds, name, isGroup } = req.body;
    if (!Array.isArray(userIds) || userIds.length < 1) {
      return res.status(400).json({ message: 'At least one user required' });
    }
    const chat = new Chat({
      name: name || '',
      isGroup: !!isGroup,
      users: [...userIds, req.user._id],
      messages: []
    });
    await chat.save();
    res.status(201).json({ success: true, chat });
  } catch (err) {
    next(err);
  }
};
