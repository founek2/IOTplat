var express = require('express');
var router = express.Router();
const models = require('../bin/models/index');
const { Sensors } = models;
const { sendDataToTopic } = require('../bin/utils/pushMessages');

function olderThenMin(time, minutes) {
     const actualTime = new Date();
     const lastTime = new Date(time);
     const diffMinutes = (actualTime - lastTime) / 1000 / 60;
     console.log(actualTime, lastTime, minutes, actualTime - lastTime, diffMinutes);
     return diffMinutes >= minutes;
}

/* find sensor by apiKey and save data */
router.post('/', function(req, res, next) {
     //    const sensor = new Sensors({title: "Weather station", body: "Stanice pro měření počasí a všeho možného."})
     const { apiKey, data } = req.body;

     // Sensors.update({apiKey},  { $push: { data: {...data, created: new Date()} } }).then((obj) => {
     Sensors.findOneAndUpdate({ apiKey }, { $set: { data: [{ ...data, created: new Date() }] } })
          .then(obj => {
               //console.log(obj);

               res.send({ status: 'success' });

               if (obj.notification) {
                    const data = obj.data[obj.data.length - 1];
                    for (sensorName in obj.notification) {
                         const { action, boundary, interval, lastNotification } = obj.notification[sensorName];
                         const sensorData = data[sensorName];

                         const notifData = {
                              title: obj.title,
                              body: `${sensorName} je ${sensorData.value} ${sensorData.unit}`,
                              icon: '/faviconRet.png',
                              click_action: 'https://iotplatforma.cloud',
                              image: obj.imgPath
                         };

                         if (!lastNotification || olderThenMin(lastNotification, interval)) {
                              if (action == 'below' && sensorData.value < boundary) {
                                   sendDataToTopic(obj._id, sensorName, notifData)
                                        .then(() => {
                                             obj.notification[sensorName].lastNotification = new Date();
                                             obj.markModified(`notification.${sensorName}.lastNotification`);
                                             obj.save();
                                        })
                                        .catch(err => {
                                             console.log(err);
                                        });
                              } else if (action == 'over' && sensorData.value > boundary) {
                                   sendDataToTopic(obj._id, sensorName, notifData, sensorName)
                                        .then(() => {
                                             obj.notification[sensorName].lastNotification = new Date();
                                             obj.markModified(`notification.${sensorName}.lastNotification`);
                                             obj.save();
                                        })
                                        .catch(err => {
                                             console.log(err);
                                        });
                              }
                         }
                    }
               }
          })
          .catch(er => {
               console.log('Catch, unknown APIKey: ', apiKey, er);
               res.send({ status: 'error' });
          });
});

module.exports = router;
