const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Listing = db.Listing;
const User = db.User;

module.exports = {
    getAll,
    getOwned,
    getById,
    getFlatAccount,
    addListing,
    update,
    delete: _delete
};

//Return all listings in the database, regardless of owner
async function getAll() {
    return await Listing.find();
}

//Find and return all listings in the database that have the specified flat_id field
async function getOwned(id) {
    const listings = await Listing.find({ flat_id: id } );
    return listings;
}

//Find and return the specified listing from the database
async function getById(id) {
    return await Listing.findById(id);
}

//Find the flat account that owns the specified listing
async function getFlatAccount(id) {
  const listing = await Listing.findById(id);
  const user = await User.findById(listing.flat_id);
  return user;
}

//Create a new listing from the provided parameters, save it to the database and return
async function addListing(listingparam) {
    const flat_id = listingparam.flat_id;
    const description = listingparam.description;
    const utilities = listingparam.utilities;
    const rent = Number(listingparam.rent);
    const rentUnits = listingparam.rentUnits;
    const roomAvailable = Date.parse(listingparam.roomAvailable);

    const newListing = new Listing({
        flat_id,
        description,
        utilities,
        rent,
        rentUnits,
        roomAvailable,
        active: true
    });

    return await newListing.save();
}

//Find the specified listing, then update the provided parameters in the database and return the updated listing
async function update(id, listingparam) {
    const listing = await Listing.findById(id);
    Object.assign(listing, listingparam.body);
   return await listing.save();
}

//Find and delete the specified listing
async function _delete(id) {
    return await Listing.findByIdAndRemove(id);
}