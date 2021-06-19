// A helper function to assert the request ID param is valid
// and convert it to a number (since it comes as a string by default)
const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET,
        api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/user/login',
            '/api/v1/user/register',
            // { url: /(.*)/ },
        ],
    });
}

function errHandler(err, req, res, next) {
    if (err && err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'Unauthorized token.' });
    }
    console.warn(err);
    res.status(500).send({ message: 'Server Error' });
}

function getIdParam(req) {
    const id = req.params.id;
    if (/^\d+$/.test(id)) {
        return Number.parseInt(id, 10);
    }
    throw new TypeError(`Invalid ':id' param: "${id}"`);
}

function isRevoked(req, payload, done) {
    if (payload.roleId > 101) {
        done(null, true);
    }
    done();
}
module.exports = { getIdParam, authJwt, errHandler };
