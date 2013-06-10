"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	serverStatus: function (callback) {
		var hClient = new HttpClient({auth: "root:"+this.confData.server.rootPassword});

		hClient.get("/server", function (error, result) {
			if (error === null) {
				if (typeof callback === "function") {
					callback(null, result);
				}
			} else {
				callback(error);
			}
		});
	}
};