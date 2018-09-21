export default function(jwt) {
	const state = JSON.parse(localStorage.getItem('state'));
     return state
          ? state
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
			  },
			  route: "/",
            };
};
