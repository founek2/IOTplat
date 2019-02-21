importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
     messagingSenderId: '712727465412'
});

const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
     console.log('[firebase-messaging-sw.js] Received background message ', payload.data);
     // Customize notification here
     if (payload.data) {
          const { data } = payload;
          const { unit, value } = JSON.parse(data.sensorData);

          const options = {
               body: data.sensorName + ' ' + value + ' ' + unit,
               icon: '/faviconRet.png',
               click_action: 'https://iotplatforma.cloud'
          };
          // If it's okay let's create a notification
          return self.registration.showNotification(data.title, options);
     }
});
