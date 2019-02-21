export default function onEnter(callback) {
     return event => {
          if (event.keyCode === 13) {
               callback(event);
          }
     };
};