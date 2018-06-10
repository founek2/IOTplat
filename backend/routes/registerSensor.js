var express = require('express');
var router = express.Router();
const Sensors = require('../bin/models/sensors');

/* register sensor and return api key */
router.post('/', function(req, res, next) {
	console.log("register")
      const {
            title,
            body,
		  url,
		  canUpdateDataActual
      } = req.body.sensor;
  //    const sensor = new Sensors({title: "Weather station", body: "Stanice pro měření počasí a všeho možného."})
      const sensor = new Sensors({title, body, url, canUpdateDataActual})
      sensor.save().then((createdObj) => {
            res.send({apiKey: createdObj.apiKey});
      })
});

module.exports = router;
