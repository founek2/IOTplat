const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Jwt = require("../utils/jwt");

const userSchema = new Schema({
     userName: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     created: { type: Date, default: Date.now },
     level: { type: Number, default: 3 },
     firstName: String,
     lastName: String
});

userSchema.statics.findAllByUserName = function(userName) {
     return this.model('Users').find({ userName: userName });
};

userSchema.statics.findOneUser = function(userName) {
     return this.model('Users').findOne({ userName: userName });
};

userSchema.statics.checkCreditals = function(userName, password) {
     return this.model('Users')
          .findOne({ userName: userName }, 'password level userName firstName lastName -_id')
          .then(doc => {
			//console.log(doc)
             return  bcrypt.compare(password, doc.password).then(res => {
			   if(res){
					console.log(doc)
					doc.password = undefined;
					return Jwt.sign(doc.toJSON()).then(token => {
						return {jwt: token, level: doc.level}
					 })

			   }else {
				   return false;
			   }
		   })
          });
};

const User = mongoose.model('Users', userSchema);
module.exports = User;
