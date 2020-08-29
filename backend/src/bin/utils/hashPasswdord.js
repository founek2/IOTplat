const bcrypt = require("bcrypt")

module.exports = (plainText) => bcrypt.hash(plainText, 10)