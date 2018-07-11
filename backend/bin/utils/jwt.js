const jwt = require('jsonwebtoken');
const fs = require("fs")
const path = require('path');

const privKey = fs.readFileSync(path.join(__dirname,'../../cert/private.key'));
const pubKey = fs.readFileSync(path.join(__dirname,'../../cert/public.key.pub'));

function Jwt(){};
Jwt.sign = function(object){
	return new Promise(function(resolve, reject) {
		jwt.sign(object, privKey, { algorithm: 'RS256', expiresIn: '336h' }, function(err, token) {
			if (!err){
				console.log(token)
				resolve(token)
			}else {
				reject();
			}
		   });
	})
}
Jwt.verify = function(token){
	return new Promise(function(resolve, reject) {
		jwt.verify(token, pubKey, { algorithms: ['RS256'] }, function (err, payload) {
			if (!err){
				resolve(payload);
			}else {
				reject("Nevalidní token");
			}
	   	});
	})
}

module.exports = Jwt