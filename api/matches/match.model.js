const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchListSchema = new Schema({
    flateeUsername: { type: String },
    flateeID: { type: String },
    listingUsername: { type: String },
    listingID: { type: String },
    matchedDate: { type: Date, default: null }, //only when matchState is 'matched', then update the matchedDate from null
    //to Date.now
    matchState: { type: String, enum: ['no-match', 'flatee-pending', 'list-pending', 'matched'], default: 'no-match' },
});

matchListSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('matchList', matchListSchema);