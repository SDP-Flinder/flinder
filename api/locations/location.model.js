const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
        city: {type: String},
        region: {
          type: Object,
          properties: {
              name: {
                type: String,
              },
              suburb: {
                type: [String],
              }
          }
        }
});

LocationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
  }
});

module.exports = mongoose.model('Location', LocationSchema);