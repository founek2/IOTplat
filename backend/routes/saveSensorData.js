var express = require('express');
var router = express.Router();
const models = require('../bin/models/index');
const { Sensors } = models;
/* find sensor by apiKey and save data */
router.post('/', function(req, res, next) {
     //    const sensor = new Sensors({title: "Weather station", body: "Stanice pro měření počasí a všeho možného."})
     const { apiKey, data } = req.body;

     // Sensors.update({apiKey},  { $push: { data: {...data, created: new Date()} } }).then((obj) => {
     Sensors.update({ apiKey }, { $set: { data: [{ ...data, created: new Date() }] } })
          .then((obj) => {
               if (obj.nModified === 1) {
                    res.send({ status: 'success' });
               } else {
                    console.log('unknown APIKey: ', apiKey);
                    res.send({ status: 'error' });
               }
          })
          .catch(() => {
               console.log('Catch, unknown APIKey: ', apiKey);
          });
});

module.exports = router;
