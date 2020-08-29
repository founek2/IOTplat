const mongoose = require('mongoose');
const hat = require('hat');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
     title: String,
     body: String,
     created: { type: Date, default: Date.now },
     data: Array, //[ { teplota: { value: 49, unit: "C" } } ]
     apiKey: { type: String, default: hat },
     url: String,
     manageData: Object, // {relay: {state: 0, description: Ovládání světla hlavního pokoje, type: "on/off"}, led: {state: 0, description: Ovládání ledky, hidden: true, type: "on/off"}}
     manageable: Boolean,
	imgPath: String,
	controllerOf: Array,
	notification: Object // {relay: {interval: 5, boundary: 10, action: "over"}}
});
sensorSchema.statics.findByApiKey = function(apiKey) {
     return this.model('Sensors').findOne({ apiKey: apiKey });
};

sensorSchema.statics.updateDataActual = function(id, data, oldData) {
     console.log(data, oldData);
     const keys = Object.keys(data);
     const newData = oldData;
     keys.forEach(key => {
          newData[key].state = data[key];
     });
     console.log(newData);
     return this.model('Sensors').findByIdAndUpdate(id, {
          $set: {
               manageData: { ...newData, updated: new Date() }
          }
     });
};
sensorSchema.statics.getDataForGraph = function(id, targetTime) {
     return this.model('Sensors').aggregate([
          { $match: { _id: id } },
          { $unwind: '$data' },
          { $match: { 'data.created': { $gte: new Date(Number(targetTime)) } } },
          { $group: { _id: '$_id', data: { $push: '$data' }, title: { $last: '$title' } } }
     ]);
};

sensorSchema.statics.setNotification = function(id, senzor, obj) {
     return this.model('Sensors').findByIdAndUpdate(id, {
          $set: {
               notification: { [senzor]: obj}
          }
     });
};

module.exports = sensorSchema;
