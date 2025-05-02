const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

// Create and save a message
exports.createMessage = async (userId, chatId, content, mediaUrls) => {
  const message = new Message({
    sender: userId,
    chat: chatId,
    content,
    media: mediaUrls ? mediaUrls.map(url => ({ url, type: 'image' })) : [],
    readBy: [userId],
    reactions: []
  });
  await message.save();
  await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });
  return message;
};
