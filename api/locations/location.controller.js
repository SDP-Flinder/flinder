const express = require('express');
const router = express.Router();
const locationService = require('./location.service');
const {authorize} = require('../_helpers/authorize');
const Role = require('../_helpers/role');

//routes
router.post('/add', add);
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(),  getById);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function add(req, res, next) {
    locationService.create(req.body)
        .then((msg) => (msg == 'user-created') ? authenticate((req.body.username, req.body.password), res, next) : res.json({message: msg}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    locationService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);

    locationService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


function update(req, res, next) {
    const currentUser = req.user;
    const id = req.params.id;

    locationService.update(req.params.id, req)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    locationService.delete(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}