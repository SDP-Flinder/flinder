const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  senderId: { type: String, required: true },
  text: { type: String, required: true },
}, {timestamps: true});

const ChatSchema = new Schema({
    matchId: { type: String },
    messages: { type: [[MessageSchema]] }
  }, {timestamps: true});

  ChatSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
  }
});

module.exports = mongoose.model('Chat', ChatSchema);