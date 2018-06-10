const urlPrefix = "/api";

export default new class Api {
      constructor(errorHandler) {
            this.handleError = e => console.log(e);
      }

      setHandleError = handleError => {
            this.handleError = handleError;
      };
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
      manageData = (id, data) => {
            return fetch(urlPrefix + "/manageData", {
                  method: "POST",
                  headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ id, data })
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
