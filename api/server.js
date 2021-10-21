require('dotenv-safe').config();
require('rootpath')();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const errorHandler = require('./_helpers/error-handler');
const {authorize, blacklist} = require('./_helpers/authorize');

// Express App
const app = express();
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Extract Environment Variables
const { NODE_ENV, PORT, SESSION_KEY } = process.env;
const port = PORT || 9000;

if (NODE_ENV === 'production') {
  console.info('ENVIRONMENT: Production');
}

// API routes
const router = express.Router();
router.use('/users', require('./users/user.controller'));
router.use('/flats', require('./flats/flat.controller'));
router.use('/matches', require('./matches/match.controller'));
router.use('/listings', require('./listings/listing.controller'));
router.use('/locations', require('./locations/location.controller'));
router.use('/chat', require('./chat/chat.controller'));
router.get('/logout', authorize(), logout);

app.use('/api/', router);

// Blacklist jwt (log out)
function logout(req, res, next) {
  blacklist(req, res)
    // .then((msg) => res.json({message: msg}))
    // .catch(err => next(err));
}

// Global error handler
app.use(errorHandler);
// Handle errors.
app.use(function(req, res, next) {
  res.status(404);
  res.json({ error: 'endpoint-not-found'});
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// In Production, serve React build
if (NODE_ENV === 'production') {
  // Serve Static Files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Route all requests to client router
  app.get('*', function (_, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Serve API
app.listen(PORT, () => {
    console.info('----------');
    console.info(`🚀  API Server listening on port ${port}`);
    console.info('----------');
});

module.exports = app;
