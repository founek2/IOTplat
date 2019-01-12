const urlPrefix = "/api";

export default new class Api {
      constructor() {
		  this.handleError = e => console.log(e);
		  this.jwt = '';
      }
	 setLogOut = (fn) => {
		this.logOut = fn;
	 }
      setHandleError = handleError => {
            this.handleError = handleError;
	 };
	 setJwt = jwt => this.jwt = jwt;
	 checkStatus = (json) => {
		if (json.status === "success") {
			return json;
	    } else if (json.status === "Platnost přihlášení vypršela!"){
			this.logOut();
			throw new Error(json.status);
	    }else {
			throw new Error(json.status);
	    }
	 }
      initState = () => {
            return fetch(urlPrefix + "/initState", {
                  method: "POST",
                  headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                  }
            })
                  .then(response => response.json())
                  .then(this.checkStatus)
                  .catch(this.handleError);
      };
      manageData = (id, data, errorCallback) => {
            return fetch(urlPrefix + "/secure/manageData", {
                  method: "POST",
                  headers: {
                        Accept: "application/json",
				    "Content-Type": "application/json",
				    "Authorization-JWT": this.jwt
                  },
                  body: JSON.stringify({ id, data })
            })
                  .then(response => response.json())
                  .then(this.checkStatus)
                  .catch((e) => {errorCallback(e);this.handleError(e)});
	 };
	 login = (userName, password) => {
		return fetch(urlPrefix + "/login", {
			 method: "POST",
			 headers: {
				  Accept: "application/json",
				  "Content-Type": "application/json"
			 },
			 body: JSON.stringify({ userName, password })
		})
			 .then(response => response.json())
			 .then(this.checkStatus)
			 .catch(this.handleError);
    };
}();
