const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    updatePhoto,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'username-"' + userParam.username + '"-taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    
    // copy userParam properties to user
    Object.assign(user, userParam.body);

    // hash password if it was entered
    if (userParam.body.password) {
        user.hash = bcrypt.hashSync(userParam.body.password, 10);
    }

    console.log('user data is', user);

    return await user.save();
}

async function updatePhoto(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }


    // copy userParam properties to user
    Object.assign(user, userParam.body);

    // hash password if it was entered
    if (userParam.body.password) {
        user.hash = bcrypt.hashSync(userParam.body.password, 10);
    }

    user.photo = userParam.file.path;
    
    console.log('user data is', user);

    return await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}