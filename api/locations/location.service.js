const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Location = db.Location;


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Location.find();
}

async function getById(id) {
    return await Location.findById(id);
}

async function create(locationParam) {
    console.log('fuck you: ',çlocationParam);
    const location = new Location(locationParam);
    console.log('location details: ', location);

    // save location
    await location.save();
}

async function update(id, locationParam) {
    const location = await Location.findById(id);

    // validate
    if (!location) throw 'Location not found';

    // copy userParam properties to user
    Object.assign(location, locationParam.body);

    return await user.save();
}

async function _delete(id) {
    await Location.findByIdAndRemove(id);
}
