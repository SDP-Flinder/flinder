const mongoose = require('mongoose');
const User = require('../users/user.model');
const Schema = mongoose.Schema;

const FlatSchema = new Schema({
  ownerID: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  existingFlatmates: { type: Number, required: true }
//listings: { type: Listing[] }
});

FlatSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
  }
});

module.exports = mongoose.model('Flat', FlatSchema);