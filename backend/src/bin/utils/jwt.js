const jwt = require('jsonwebtoken');
const fs = require("fs")
const path = require('path');
const config = require("../../config")

const privKey = fs.readFileSync(path.resolve(config.jwt.privKey));
const pubKey = fs.readFileSync(path.resolve(config.jwt.pubKey));

function Jwt() { };
Jwt.sign = function (object) {
    return new Promise(function (resolve, reject) {
        jwt.sign(object, privKey, { algorithm: 'RS256', expiresIn: '336h' }, function (err, token) {
            if (!err) {
                //console.log(token)
                console.log("API token created")
                resolve(token)
            } else {
                reject();
            }
        });
    })
}
Jwt.verify = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, pubKey, { algorithms: ['RS256'] }, function (err, payload) {
            if (!err) {
                resolve(payload);
            } else {
                reject("Nevalidní token");
            }
        });
    })
}

module.exports = Jwt