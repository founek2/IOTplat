export default function(jwt) {
     return jwt
          ? JSON.parse(localStorage.getItem('state'))
          : {
                 menu: {
                      open: false
			  },
			  userMenu: {
				open: false,
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
			  },
			  loginForm: {
				  open: false,
			  },
			  user: {
				  logIn: false
			  }
            };
};
