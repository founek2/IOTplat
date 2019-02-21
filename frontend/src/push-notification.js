import firebase from 'firebase';

const config = {
     apiKey: 'AIzaSyBww1rVJYdWdZ_lnEvF_mvx7nEhVzM-Hxk',
     authDomain: 'iot-platforma.firebaseapp.com',
     databaseURL: 'https://iot-platforma.firebaseio.com',
     projectId: 'iot-platforma',
     storageBucket: 'iot-platforma.appspot.com',
     messagingSenderId: '712727465412'
};

export const initializeFirebase = () => {
     firebase.initializeApp(config);

     const messaging = firebase.messaging();

     messaging.onMessage(payload => {
          console.log('got message', payload);
          if (Notification.permission === 'granted') {
               if (payload.notification) {
                    const { title, body, icon, click_action } = payload.notification;

                    // If it's okay let's create a notification
                    var notification = new Notification(title, {body, icon, click_action});
               }
          }
     });
};

export const askForPermissioToReceiveNotifications = async () => {
     //if (Notification.permission !== "granted"){
     try {
          const messaging = firebase.messaging();
          await messaging.requestPermission();
          const token = await messaging.getToken();
          console.log('messaging token:', token);
          localStorage.setItem('notifyToken', token);
          return token;
     } catch (error) {
          console.error(error);
     }
     //}
};
