const mongoose = require("mongoose");
const hat = require("hat");
const Schema = mongoose.Schema;

const sensorSchema  = new Schema({
      title: String,
      body: String,
      created: { type: Date, default: Date.now },
      data: Array, //[ { teplota: { value: 49, unit: "C" } } ]
      apiKey: { type: String, default: hat },
      url: String,
      manageData: Object, // {relay: {state: 0, description: Ovládání světla hlavního pokoje}, led: {state: 0, description: Ovládání ledky, hidden: true}}
	 manageable: Boolean,
	 imgPath: String,
});
sensorSchema.statics.findByApiKey = function(apiKey, cb) {
      return this.model("Sensors").find({ apiKey: apiKey }, cb);
};

sensorSchema.statics.updateDataActual = function(id, data, oldData) {
	const keys = Object.keys(data);
	const newData = oldData;
	keys.forEach(key => {
		newData[key].state = data[key];
	})
      return this.model("Sensors").findByIdAndUpdate(id, {
            $set: {
                  manageData: {  ...newData, updated: new Date() }
            }
      });
};
sensorSchema.statics.getDataForGraph = function(id, targetTime) {
      return this.model("Sensors").aggregate([
            { $match: { _id: id } },
            { $unwind: "$data" },
            { $match: { "data.created": { $gte: new Date(Number(targetTime)) } } },
            { $group: { _id: "$_id", data: { $push: "$data" }, title: { $last: "$title" } } }
      ]);
};

module.exports = sensorSchema;
