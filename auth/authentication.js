const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY || 'asiudfsa';

function createToken(email) {
    const payload = {
        sub: {
            "email": email
        }
    }
    
    return jwt.sign(payload, secret, {
        expiresIn: '30m'
    })
}

function authToken(req, res, next) {
    const input_token = req.header('AuthorizationToken');

    decodeToken(input_token)
        .then((payload) => {
            req.email = payload.sub.email;
            next();
        })
        .catch(() => {
            return res.sendStatus(401);
        });
}

//Nog veranderen
function decodeToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}

module.exports = {
    createToken,
    decodeToken,
    authToken
}