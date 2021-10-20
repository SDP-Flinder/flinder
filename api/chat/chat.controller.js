const express = require('express');
const router = express.Router();
const chatService = require('./chat.service');
const {authorize} = require('../_helpers/authorize')
const Role = require('../_helpers/role');

// routes
router.post('/', authorize(), create);
router.post('/message', authorize(), message);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/:matchId', authorize(),  getByMatchId);
router.delete('/:chatid', authorize(), _delete);

module.exports = router;

function create(req, res, next) {
    chatService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function message(req, res, next) {
    chatService.message(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    chatService.getAll()
        .then(chats => res.json(chats))
        .catch(err => next(err));
}

function getById(req, res, next) {
    chatService.getById(req.params.id)
        .then(chat => chat ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByMatchId(req, res, next) {
    chatService.getById(req.params.matchId)
        .then(chat => chat ? res.json(chat) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to delete other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    chatService.delete(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}