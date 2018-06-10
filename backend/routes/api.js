var express = require("express");
var router = express.Router();
const Sensors = require("../bin/models/sensors");
var mongoose = require("mongoose");
const fetch = require("node-fetch");

/* GET home page. */
router.post("/initState", function(req, res, next) {
      /*  var id = mongoose.Types.ObjectId('5aa7ab6599cc091442dabede');
  Sensors.findById(id, {'data':{'$slice':-1}, apiKey: 0}).then((obj) => {
    console.log(obj)
    res.render('index', obj);
  })*/
      Sensors.find({}, { data: { $slice: -1 }, apiKey: 0 }, function(err, docs) {
            console.log(docs.length);
            if (!err) {
                  docs = docs.filter(({ data, manageable }) => data.length > 0 || manageable);
                  res.send({ docs, status: "success" });
            } else {
                  res.send({ status: "error" });
            }
      });
      console.log("initState");
});

router.post("/manageData", function(req, res, next) {
	 const { id, data } = req.body;

      Sensors.findById(id, "url manageable apiKey manageData")
            .then(({ url, manageable, apiKey, manageData }) => {
                  if (manageable && url) {
                        fetch(url, {
                              method: "POST",
                              body: JSON.stringify({ ...data, apiKey })
                        })
                              .then(response => response.json())
                              .then(json => {
                                    if (json.status === "success") {
                                          Sensors.updateDataActual(id, data, manageData)
                                                .then((doc, err) => {
                                                      if (!err) {
                                                            res.send({ status: "success" });
                                                      } else {
												res.send({status: "Vyskytl se problém s databází"})
                                                      }
                                                })
                                                .catch(e =>
                                                      res.send({
                                                            status: "Nastala chyba, nelze kontaktovat zařízení"
                                                      })
                                                );
                                    } else {
                                          throw "error";
                                    }
                              })
                              .catch(e => {
                                    console.log(e);
                                    res.send({ status: "Nastala chyba, zařízení nenalezeno v databázi" });
                              });
                  } else if (!url) {
                        res.send({ status: "url not provided" });
                  } else {
                        res.send({ status: "not allowed updateData" });
                  }
            })
            .catch(err => {
                  console.log(err);
                  res.send({ status: "error, cant find sensor" });
            });
});

router.post("/showGraph", function(req, res, next) {
      const { id, sensor, targetTime } = req.body;
      console.log(req.body);
      Sensors.aggregate([
            //             { $project : { _id : id, data : 1, title: 1 } },
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            { $unwind: "$data" },
            { $match: { "data.created": { $gte: new Date(targetTime) } } },
            { $group: { _id: "$_id", data: { $push: "$data" }, title: { $last: "$title" } } }
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

module.exports = router;
