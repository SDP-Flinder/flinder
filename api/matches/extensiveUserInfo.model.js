const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// this model has been created as a temporary space to include both the List + User halves. allows ease of iteration
// and information access when flatee wants to view flat cards and their extra details
const extensiveUserInfoSchema = new Schema({
    listing: { type: Object },
    accountUser : { type: Object }
});

extensiveUserInfoSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('extensiveUserInfo', extensiveUserInfoSchema);