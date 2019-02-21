const fetch = require('node-fetch');

var config;

try {
     config = require('../../config.json');
} catch(err) {}

module.exports.subscribeUserToTopic = function subscribeUserToTopic(idDevice, sensor, token) {
	topicName = idDevice + sensor;
	return topicRequest(topicName, token, "POST")
}

module.exports.unSubscribeUserFromTopic = function(idDevice, sensor, token){
	topicName = idDevice + sensor;
	return topicRequest(topicName, token, "DELETE")
}


function topicRequest(topicName, token, method){

	console.log(`user ${method} request to topic:`, `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topicName}`)
	return fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topicName}`, {
          method: method,
          headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               Authorization: `key=${config.serverKey}`
          }
     }).then((response) => {
		console.log("topic status:", response.status)
		return response.json();
	}).then(json => {
		console.log(json)
	}).catch(e => {
		console.log(e);
	})
}
module.exports.sendDataToTopic = function sendDataToTopic(idDevice, sensor, data) {
	topicName = idDevice +sensor;
	console.log("sending data to topic ;)")
     return fetch(`https://fcm.googleapis.com/fcm/send`, {
          method: 'POST',
          headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
               Authorization: `key=${config.serverKey}`
		},
		body: JSON.stringify({
			notification: data,
			to: `/topics/${topicName}`
		})
     }).catch(e => {
		console.log(subscribeUserToTopic, e);
	})
}