const mongoose = require('mongoose');
const crypto = require('crypto');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  media: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    filename: String
  }],
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String
  }]
}, { timestamps: true });

MessageSchema.pre('save', function(next) {
  if (this.isModified('content') && this.content) {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(this.content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.content = `${iv.toString('hex')}:${encrypted}`;
  }
  next();
});

MessageSchema.methods.decryptContent = function() {
  if (!this.content) return null;
  const [ivHex, encryptedContent] = this.content.split(':');
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

MessageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'name profilePicture'
  });
  next();
});

module.exports = mongoose.model('Message', MessageSchema);
