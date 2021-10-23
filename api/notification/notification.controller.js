const express = require('express');
const router = express.Router();
const notificationService = require('./notification.service');
const {authorize} = require('../_helpers/authorize');

// routes
router.get('/', authorize(), getAllUsersNotifications);
router.post('/', authorize(), addNotification);
router.put('/read/:id', authorize(), read);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAllUsersNotifications(req, res, next) {
    notificationService.getAllUsersNotifications(req.user.sub)
        .then(notifications => notifications ? res.json(notifications) : res.json([]))
        .catch(err => next(err));
}

function addNotification(req, res, next) {
    notificationService.addNotification(req.body)
        .then(() => res.json({message: 'success-notification-added'}))
        .catch(err => next(err));
}

function read(req, res, next) {
    notificationService.read(req.params.id)
        .then(notification => notification ? res.json(notification) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    notificationService.delete(req.params.id)
        .then(notification => notification ? res.json(notification) : res.sendStatus(404))
        .catch(err => next(err));
}
