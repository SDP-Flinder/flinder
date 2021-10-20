require('dotenv').config()
const mongoose = require('mongoose')
const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yqn5t.mongodb.net/flinder?retryWrites=true&w=majority`
//process.env.MONGODB_URI
// mongoose
//     .connect(MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true })
//     .catch(e => {
//         console.error('Connection error', e.message)
//     })

// const db = mongoose.connection

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Flat: require('../flats/flat.model'),
    matchList: require('../matches/match.model'),
    Listing: require('../listings/listing.model'),
    Location: require('../locations/location.model'),
};