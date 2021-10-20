const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Flat = db.Flat;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Flat.find();
}

async function getById(id) {
    return await Flat.findById(id);
}

async function create(flatparam) {
    // check address
    // if (await Flat.findOne({ Flatname: flatparam.Flatname })) {
    //     throw 'Flatname "' + flatparam.Flatname + '" is already taken';
    // }

    // const Flat = new Flat(flatparam);

    // // save Flat
    // await Flat.save();
}

async function update(id, flatparam) {
    const Flat = await Flat.findById(id);

    // validate
    if (!Flat) throw 'Flat not found';
    // if (Flat.Flatname !== flatparam.Flatname && await Flat.findOne({ Flatname: flatparam.Flatname })) {
    //     throw 'Flatname "' + flatparam.Flatname + '" is already taken';
    // }

    // copy flatparam properties to Flat
    Object.assign(Flat, flatparam);

    await Flat.save();
}

async function _delete(id) {
    await Flat.findByIdAndRemove(id);
}