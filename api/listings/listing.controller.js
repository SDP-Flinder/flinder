const express = require('express');
const router = express.Router();
const listingService = require('./listing.service');
const {authorize} = require('../_helpers/authorize')
const Role = require('../_helpers/role');


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');

    },
    filename: function(req, file,cb) {
        cb(null, Date.now() + file.originalname.replace(/\s/g, '_'));
    }
});

//This doesn't work
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);     //accept the file
    } else {
        //reject
        cb(null, false);
    }

};

const upload = multer({
    storage: storage,
});


// routes
router.post('/add', authorize(Role.Flat), addListing)
router.get('/flat/:id', authorize(Role.Flat), getOwned);
router.get('/all', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/flatAccount/:id', authorize(), getFlatAccount);
router.put('/:id', authorize(Role.Flat), update);
router.put('/photo/:id', authorize(Role.Flat), upload.single('profileImage'), updatePhoto);
router.delete('/:id', authorize(Role.Flat), _delete);

function addListing(req, res, next) {
    listingService.addListing(req.body)
        .then(listing => res.json(listing))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    listingService.getAll()
        .then(listings => res.json(listings))
        .catch(err => next(err));
}

function getOwned(req, res, next) {
    listingService.getOwned(req.params.id)
        .then(listing => listing ? res.json(listing) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    listingService.getById(req.params.id)
        .then(listing => listing ? res.json(listing) : res.sendStatus(404))
        .catch(err => next(err));
}

function getFlatAccount(req, res, next) {
  listingService.getFlatAccount(req.params.id)
      .then(user => user ? res.json(user) : res.sendStatus(404))
      .catch(err => next(err));
}

//Will look at adding role/account checks in a future release, if necessary
function update(req, res, next) {
    listingService.update(req.params.id, req)
        .then(listing => listing ? res.json(listing) : res.sendStatus(404))
        .catch(err => next(err));
}

function updatePhoto(req, res, next) {
    const photo = req.file;
    console.log(photo);
    const id = req.params.id;

    listingService.updatePhoto(req.params.id, req)
        .then(listing => listing ? res.json(listing) : res.sendStatus(404))
        .catch(err => next(err));
}

//Will look at adding role/account checks in a future release, if necessary
function _delete(req, res, next) {
    listingService.delete(req.params.id)
        .then(listing => listing ? res.json(listing) : res.sendStatus(404))
        .catch(err => next(err));
}

module.exports = router;