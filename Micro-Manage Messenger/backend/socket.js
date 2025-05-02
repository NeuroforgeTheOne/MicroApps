const User = require('./models/User');
const Chat = require('./models/Chat');
const Message = require('./models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Join user to their own room
    socket.on('join', ({ userId }) => {
      socket.join(userId);
      User.findByIdAndUpdate(userId, { status: 'online' }).exec();
    });

    // Typing indicator
    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { userId });
    });
    socket.on('stopTyping', ({ chatId, userId }) => {
      socket.to(chatId).emit('stopTyping', { userId });
    });

    // Join chat room
    socket.on('joinChat', ({ chatId }) => {
      socket.join(chatId);
    });

    // Send message
    socket.on('sendMessage', async ({ chatId, senderId, content, media }) => {
      const message = new Message({
        sender: senderId,
        chat: chatId,
        content,
        media: media || [],
        readBy: [senderId],
        reactions: []
      });
      await message.save();
      await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });
      io.to(chatId).emit('newMessage', message);
    });

    // Read message
    socket.on('readMessage', async ({ messageId, userId, chatId }) => {
      await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: userId } });
      io.to(chatId).emit('messageRead', { messageId, userId });
    });

    // Emoji reaction
    socket.on('reactMessage', async ({ messageId, userId, emoji, chatId }) => {
      await Message.findByIdAndUpdate(messageId, { $push: { reactions: { user: userId, emoji } } });
      io.to(chatId).emit('messageReaction', { messageId, userId, emoji });
    });

    // Leave chat room
    socket.on('leaveChat', ({ chatId }) => {
      socket.leave(chatId);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { status: 'offline', lastSeen: new Date() });
      }
    });
  });
};
