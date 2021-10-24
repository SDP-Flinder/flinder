require('dotenv-safe').config();
require('rootpath')();
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const errorHandler = require('./_helpers/error-handler');
const {authorize, blacklist} = require('./_helpers/authorize');

// Controllers containing routes
const userController = require('./users/user.controller');
const matchController = require('./matches/match.controller');
const listingController = require('./listings/listing.controller')
const flatController = require('./flats/flat.controller');
const locationController = require('./locations/location.controller');
const chatController = require('./chat/chat.controller');
const notificationController = require('./notification/notification.controller');

// Express App
const app = express();
app.use(cors({origin: ['http://localhost:3000'], credentials:true}));
// app.use(cors({origin: '*'}));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

// Extract Environment Variables
const { NODE_ENV, PORT, SESSION_KEY } = process.env;
const port = PORT || 9000;

if (NODE_ENV === 'production') {
  console.info('ENVIRONMENT: Production');
}

// API routes
const router = express.Router();
router.use('/users', userController);
router.use('/flats', flatController);
router.use('/matches', matchController);
router.use('/listings', listingController);
router.use('/locations', locationController);
router.use('/chat', chatController);
router.use('/notifications', require('./notification/notification.controller'));
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

// // In Production, serve React build
// if (NODE_ENV === 'production') {
//   // Serve Static Files
//   app.use(express.static(path.join(__dirname, '../client/build')));

//   // Route all requests to client router
//   app.get('*', function (_, res) {
//     res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
//   });
// }

// Serve API
app.listen(PORT, () => {
    console.info('----------');
    console.info(`🚀  API Server listening on port ${port}`);
    console.info('----------');
});

module.exports = app;
