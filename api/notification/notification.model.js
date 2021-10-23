const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userID: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: {type: String },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

notificationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('notification', notificationSchema);