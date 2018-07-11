var express = require('express');
var router = express.Router();
const models = require('../bin/models/index');
const path = require("path");

router.get('/controlPanel', function(req, res) {
	res.sendFile("index.html", { root: path.join(__dirname, '../public')})
})



module.exports = router;
