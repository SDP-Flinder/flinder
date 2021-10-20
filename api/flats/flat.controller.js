const express = require('express');
const router = express.Router();
const flatService = require('./flat.service');
const {authorize} = require('../_helpers/authorize')
const Role = require('../_helpers/role');

// routes
router.post('/create', authorize(Role.Flat), create)
router.get('/', authorize(Role.Flat), getOwned);
router.get('/all', authorize(Role.Admin), getAll);
router.get('/:id', authorize(),  getById);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function create(req, res, next) {
    flatService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    flatService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getOwned(req, res, next) {
    flatService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    flatService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to update other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    flatService.update(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to delete other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    flatService.delete(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}