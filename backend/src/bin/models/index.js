const sensorsSchema = require("../schemas/sensors")
const modelUsers = require("../schemas/user")
const mongoose = require('mongoose');
const modelSensors  = mongoose.model('Sensors', sensorsSchema);
//const modelUsers = mongoose.model('Users', userSchema);

//const neco = new model({title: "Měření teploty", body: "popis této bezvádné stanice pro měření", apiKey: "c17a79c2b60dc79df629f7b7b6e7f6a4"})
//neco.save()

module.exports = {Sensors: modelSensors, Users:  modelUsers};