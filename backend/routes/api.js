var express = require('express');
var router = express.Router();
const models = require('../bin/models/index');
var mongoose = require('mongoose');
const fetch = require('node-fetch');
const hashPassword = require('../bin/utils/hashPasswdord');
const { Sensors, Users } = models;
const { subscribeUserToTopic, unSubscribeUserFromTopic } = require('../bin/utils/pushMessages');

/**
 * for Sensor init - mostly on powerOff to send actual state
 */
router.post('/updateSensorState', function(req, res) {
     console.log(req.body);
     const { apiKey, ...restBody } = req.body;
     console.log('to');
     if (apiKey) {
          Sensors.findByApiKey(apiKey).then(doc => {
               if (doc) {
                    const { manageData } = doc;

                    Sensors.updateDataActual(doc._id, restBody, manageData).then(neco => {
                         res.send({ status: 'success' });
                    });
               } else {
                    res.send({ error: 'invalidApiKey' });
               }
          });
     } else {
          res.send({ error: 'ApiKey must be provided' });
     }
});

/**
 * for Sensor which can controll other
 */
router.post('/controllSensor', function(req, res) {
     const { apiKey, update } = req.body;

     if (apiKey) {
          Sensors.findByApiKey(apiKey).then(doc => {
               update.forEach(({ id, ...data }) => {
                    if (doc.controllerOf.some(conId => conId === id)) {
                         updateSensorAndSendUpdate(id, data, res);
                    } else {
                         res.send({ error: 'Not allowed' });
                    }
               });
          });
     } else {
          res.send({ error: 'ApiKey must be provided' });
     }
});

/**
 * get initState for frontend
 */
router.post('/initState', function(req, res, next) {
     Sensors.find({}, { data: { $slice: -1 }, apiKey: 0 }).sort([['_id', 1]]).then(docs => {
               // docs = docs.filter(({ data, manageable }) => data.length > 0 || manageable);
               res.send({ docs, status: 'success' });
    
	}).catch(err => {
		console.log(err);
		res.send({ status: 'error' });
	})
     console.log('initState');
});

/**
 * manageData of sensor
 */
router.post('/secure/manageData', function(req, res, next) {
     const { id, data } = req.body;
     updateSensorAndSendUpdate(id, data, res);
});

router.post('/showGraph', function(req, res, next) {
     const { id, sensor, targetTime } = req.body;
     console.log(req.body);
     Sensors.aggregate([
          //             { $project : { _id : id, data : 1, title: 1 } },
          { $match: { _id: mongoose.Types.ObjectId(id) } },
          { $unwind: '$data' },
          { $match: { 'data.created': { $gte: new Date(targetTime) } } },
          { $group: { _id: '$_id', data: { $push: '$data' }, title: { $last: '$title' } } }
     ]).then(docs => {
          console.log(docs);
          const doc = docs[0];
          if (doc) {
               const newData = doc.data.map(item => Number(item[sensor].value));
               const today = new Date();
               today.setMinutes(0);
               today.setHours(0);
               const labels = doc.data.map(item => item.created);
               res.send({ data: newData, labels });
          } else {
               res.send({ data: [] });
          }
     });
});

/**
 * registerUser - for now not secured
 */
router.post('/registerUser', function(req, res) {
     const { userName, password } = req.body;
     console.log(userName, password);
     //Users.registerUser(userName, passowrd, "a", "s");¨
     Users.findAllByUserName(userName).then(docs => {
          if (docs.length === 0) {
               hashPassword(password)
                    .then(hash => {
                         const user = new Users({ userName, password: hash });
                         user.save()
                              .then(() => {
                                   res.send({ status: 'Uživatel vytvořen' });
                              })
                              .catch(() => {
                                   res.send({ status: 'Nastala chyba!' });
                              });
                    })
                    .catch(() => {
                         res.send({ status: 'Nastala chyba!' });
                    });
          } else {
               res.send({ status: 'Uživatel již existuje' });
          }
     });
});

router.post('/login', function(req, res) {
     const { userName, password } = req.body;
     if (userName.length > 2 && password.length > 2) {
          Users.checkCreditals(userName, password)
               .then(({ jwt, level }) => {
                    if (jwt) {
                         res.send({ status: 'success', jwt, level });
                    } else if (jwt === false) {
                         res.send({ status: 'Špatné heslo' });
                    } else if (jwt === null) {
                         res.send({ status: 'Neznámí uživatel' });
                    }
               })
               .catch(() => res.send({ status: 'Nastala chyba!' }));
     } else {
          res.send({ status: 'Minimální délka jména/hesla je 3!' });
     }
});

function updateSensorAndSendUpdate(id, data, res) {
     console.log('data', data);

     Sensors.findById(id, 'url manageable apiKey manageData')
          .then(({ url, manageable, apiKey, manageData }) => {
               if (manageable && url) {
                    for (const key in data) {
                         const val = data[key];
                         if (val === 'change') {
                              if (manageData[key].state === 0) {
                                   data[key] = 1;
                              } else if (manageData[key].state === 1) {
                                   data[key] = 0;
                              }
                         }
                    }
                    fetch(url, {
                         method: 'POST',
                         body: JSON.stringify({ ...data, apiKey })
                    })
                         .then(response => response.json())
                         .then(json => {
                              if (json.status === 'success') {
                                   Sensors.updateDataActual(id, data, manageData)
                                        .then((doc, err) => {
                                             if (!err) {
                                                  res.send({ status: 'success' });
                                             } else {
                                                  res.send({ status: 'Vyskytl se problém při ukládání nových dat' });
                                             }
                                        })
                                        .catch(e =>
                                             res.send({
                                                  status: 'Vyskytl se problém při ukládání nových dat'
                                             })
                                        );
                              } else {
                                   res.send({
                                        status: 'Zařízení nepřijalo data'
                                   });
                              }
                         })
                         .catch(e => {
                              console.log(e);
                              res.send({ status: 'Nastala chyba, nelze kontaktovat zařízení' });
                         });
               } else if (!url) {
                    res.send({ status: 'url not provided' });
               } else {
                    res.send({ status: 'not allowed updateData' });
               }
          })
          .catch(err => {
               console.log(err);
               res.send({ status: 'Nastala chyba, zařízení nenalezeno v databázi' });
          });
}

router.post('/secure/notifySensor', function(req, res) {
     const { notifyObj, messageToken, _id } = req.body;
     const { sensor } = notifyObj;
     delete notifyObj.sensor;

     Sensors.setNotification(_id, sensor, notifyObj)
          .then(() => {
               subscribeUserToTopic(_id, sensor, messageToken).then(() => {
                    res.send({ status: 'success' });
               });
          })
          .catch(err => {
               console.log(err);
               res.send({ status: 'Nastala chyba, zařízení nenalezeno v databázi' });
          });
});

router.delete('/secure/notifySensor', function(req, res) {
     const { notifyObj, messageToken, _id } = req.body;
     const { sensor } = notifyObj;

     Sensors.setNotification(_id, sensor, {})
          .then(() => {
               unSubscribeUserFromTopic(_id, sensor, messageToken).then(() => {
                    res.send({ status: 'success' });
               });
          })
          .catch(err => {
               console.log(err);
               res.send({ status: 'Nastala chyba, zařízení nenalezeno v databázi' });
          });
});
module.exports = router;
