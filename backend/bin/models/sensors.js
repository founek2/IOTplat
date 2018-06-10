const sensorsSchema = require("../schemas/sensors")
const mongoose = require('mongoose');
const model  = mongoose.model('Sensors', sensorsSchema);


//const neco = new model({title: "Měření teploty", body: "popis této bezvádné stanice pro měření", apiKey: "c17a79c2b60dc79df629f7b7b6e7f6a4"})
//neco.save()

module.exports = model;