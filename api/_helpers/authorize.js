const expressJwt = require('express-jwt');
const expressBlacklist = require('express-jwt-blacklist');
const { secret } = require('../config.json');

module.exports = {
    authorize,
    blacklist
};

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.Flat or 'Flat') 
    // or an array of roles (e.g. [Role.Admin, Role.Flat] or ['Admin', 'Flat'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        
        expressJwt({ secret, algorithms: ['HS256'], isRevoked: expressBlacklist.isRevoked }).unless({
            path: [
                // public routes that don't require authentication
                '/users/authenticate',
                '/users/register'
            ]
        }),

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}

function blacklist(req, res) {
    const authString = req.headers.authorization;
    if (authString.startsWith("Bearer ")){
        token = authString.substring(7, authString.length);
        expressBlacklist.revoke(token)
        res.status(200).json({message: 'token-revoked', token: token});
    } else {
        res.status(400).json({message: 'revoke-failed'});
    }
        // .then(user => user ? res.json(user) : res.status(400).json({ message: 'incorrect-username-password' }))
        // .catch(err => next(err));
}

// async function isRevoked(req, payload, done) {
//     const user = await userService.getById(payload.sub);

//     // revoke token if user no longer exists
//     if (!user) {
//         return done(null, true);
//     }

//     done();
// };