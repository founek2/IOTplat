var express = require("express");
var router = express.Router();
const models = require("../bin/models/index");
const {Sensors} = models;
var mongoose = require("mongoose");
var formatDate = require("../bin/utils/formatDateGraph");

/* GET home page. */
router.get("/", function(req, res, next) {
      const id = mongoose.Types.ObjectId(req.query.id);
      const targetTime = req.query.targetTime;
      console.log(new Date(Number(req.query.targetTime)));
      Sensors.getDataForGraph(id, targetTime).then(docs => {
            console.log(docs);
            const doc = docs[0];
            if (doc) {
                  const newData = doc.data.map(item => Number(item[req.query.sensor].value));
                  const today = new Date();
                  today.setMinutes(0);
                  today.setHours(0);
                  const labels = doc.data.map(item => {
                        const time = new Date(item.created);
                        return formatDate(time, today);
                        /*if(time < today) {
                              return (
                                    time.getDate() + ". "+
                                    (time.getMonth() + 1) + ". " +
                                    time.getHours() +
                                    ":" +
                                    ("0" + time.getMinutes()).slice(-2)
                              );
                        }else {
                              return (
                                    time.getHours() +
                                    ":" +
                                    ("0" + time.getMinutes()).slice(-2)
                              );
                        }*/
                  });
                  if (req.query.api == 1) {
                        res.send({ data: newData, labels });
                  } else {
                        res.render("graph", {
                              data: newData,
                              title: doc.title,
                              numberOfRecords: req.query.numberOfRecords,
                              id,
                              labels,
                              sensor: req.query.sensor
                        });
                  }
            } else {
                  if (req.query.api == 1) {
                        res.send({ data: [] });
                  } else {
                        res.render("graph", {
                              data: [],
                              labels: [],
                              title: "data nejsou k dispozici",
                              numberOfRecords: req.query.numberOfRecords,
                              id,
                              sensor: req.query.sensor
                        });
                  }
            }
      });
});

function daysInMonth(d) {
      return new Date(d.getFullYear(), d.getMonth + 1, 0).getDate();
}
module.exports = router;
