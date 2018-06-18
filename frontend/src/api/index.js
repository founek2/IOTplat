import {compose} from 'ramda';
const urlPrefix = "/api";

export default new class Api {
      constructor(errorHandler) {
            this.handleError = e => console.log(e);
      }

      setHandleError = handleError => {
            this.handleError = handleError;
	 };
	 setJwt = jwt => this.jwt = jwt;
      initState = () => {
            return fetch(urlPrefix + "/initState", {
                  method: "POST",
                  headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                  }
            })
                  .then(response => response.json())
                  .then(checkStatus)
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
                  .then(checkStatus)
                  .catch(compose(errorCallback,this.handleError));
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
			 .then(checkStatus)
			 .catch(this.handleError);
    };
}();

function checkStatus(json) {
      if (json.status === "success") {
            return json;
      } else {
            throw new Error(json.status);
      }
}
