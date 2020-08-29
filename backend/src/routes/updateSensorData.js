var express = require("express");
var router = express.Router();
const models = require('../bin/models/index');
const {Sensors} = models;
const fetch = require("node-fetch");
/* find sensor by apiKey and save data */
router.post("/", function(req, res, next) {
      //    const sensor = new Sensors({title: "Weather station", body: "Stanice pro měření počasí a všeho možného."})
      const { id, data } = req.body;
      Sensors.findById(id, "url manageable apiKey")
            .then(({ url, manageable, apiKey }) => {
                  if (manageable && url) {

				Sensor.updateDataActual(id, data).then((doc, err) => {
					console.log(err, doc)
					if (!err) {
						 res.send({ status: "success" });
					} else {
						 
					}
			    })
                      /*  fetch(url, {
                              method: "POST",
                              body: JSON.stringify({ ...data, apiKey })
                        })
                              .then(response => response.json())
                              .then(json => {
                                    if (json.status === "success") {
                                          Sensor.updateDataActual(id, data).then(err, obj => {
                                                if (!err) {
                                                      res.send({ status: "success" });
                                                } else {
                                                      throw "error";
                                                }
								  })
								  .catch((e) => res.send({ status: "error, cant update dataActual" }))
                                    } else {
                                          throw "error";
                                    }
                              })
                              .catch(e => {
                                    console.log(e);
                                    res.send({ status: "error, fetch failed" });
						});
						*/
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

module.exports = router;
