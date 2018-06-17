export default (function() {
     const jwt = localStorage.getItem('jwt');
     return jwt
          ? JSON.parse(localStorage.getItem('state'))
          : {
                 menu: {
                      open: false
                 },
                 snackbar: {
                      open: false,
                      hideDuration: 6000,
                      message: 'Není připojení k internetu!'
                 },
                 sensors: {
                      data: []
                 },
                 controlPanel: {
                      data: []
                 }
            };
})();
