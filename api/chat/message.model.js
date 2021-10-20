const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  chatId: { type: String, required: true },
  sender: { type: String, required: true },
  text: { type: String, required: true },
}, {timestamps: true});

MessageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
  });
  
module.exports = mongoose.model('Message', MessageSchema);