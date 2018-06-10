var express = require('express');
var router = express.Router();
const Sensors = require('../bin/models/sensors');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
/*  var id = mongoose.Types.ObjectId('5aa7ab6599cc091442dabede');
  Sensors.findById(id, {'data':{'$slice':-1}, apiKey: 0}).then((obj) => {
    console.log(obj)
    res.render('index', obj);
  })*/
  Sensors.find({},{'data':{'$slice':-1}, apiKey: 0}, function(err, docs) {
    if (!err){
      res.render('index', {docs});
    } else {throw err;}
});

});

module.exports = router;
