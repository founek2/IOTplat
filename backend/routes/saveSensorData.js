var express = require('express');
var router = express.Router();
const Sensor = require('../bin/models/sensors');

/* find sensor by apiKey and save data */
router.post('/', function(req, res, next) {
  //    const sensor = new Sensors({title: "Weather station", body: "Stanice pro měření počasí a všeho možného."})
  const {
        apiKey,
        data
  } = req.body;

  Sensor.update({apiKey},  { $push: { data: {...data, created: new Date()} } }).then((obj) => {
        if(obj.nModified === 1){
            res.send({status: "success"})
        }else {
            res.send({status: "error"})
        }
        
  })
});

module.exports = router;
