"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	runBatch: function (options, callback) {

		var batchRequest = {
			transaction: options.transaction || true,
			operations: options.operations || null
		};

		if (batchRequest.operations === null) {
			var hClient = new HttpClient();
			var endpoint = "/batch/" + this.confData.database.name;

			var postREquest = {
				endPoint: endpoint,
				data: batchRequest
			};

			hClient.post(postREquest, function (error, result) {
				if (error === null) {
					if (typeof callback === "function") {
						callback(null, result);
					}
				} else {
					callback(error);
				}
			});
		}
	}
};