const db = require('../_helpers/db');
const dbnotification = db.Notification;
const dbuser = db.User;

module.exports = {
    getAllUsersNotifications,
    addNotification,
    read,
    delete: _delete
};

/**
 * 
 * @param {*} userID 
 * @returns array of json notification objects
 */
async function getAllUsersNotifications(userID) {
    let user = await dbuser.findById(userID)

    if (user !== null) { // Check if user defined
        if (user.receiveNotifications) { // Check if user wants to receive notifications
            return await dbnotification.find({ userID: userID, read: false });
        }
    } else {
        throw 'user-' + userID + '-not-found';
    }
}

/**
 * Adds a new notification given userID, title, message to db
 * @param {*} notificationParams 
 */
async function addNotification(notificationParams) {
    // validate if user exists given id
    if (!await dbuser.findById(notificationParams.userID)) {
        throw 'user-' + notificationParams.userID + '-not-found';
    }

    const notification = new dbnotification(notificationParams);

    await notification.save();
}

/**
 * Given an id, updates the notifications read status to true in the db
 * @param {*} id 
 * @returns 
 */
async function read(id) {
    const notification = await dbnotification.findById(id);
    if (!notification) throw 'notification-not-found';

    notification.read = true;

    return await notification.save();
}

async function _delete(id) {
    await dbnotification.findByIdAndRemove(id);
}