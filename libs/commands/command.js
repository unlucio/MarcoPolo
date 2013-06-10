"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	runCommand: function (options, callback) {

		var commandRequest = {
			text: "SELECT FROM OUser",
			language: "sql",
			limit: 100, // default is 20
			fetchPlan: "*:0"
		};

		var commandText = encodeURIComponent(options.text || "");
		var language = options.language || "sql";
		var limit = options.limit || 20;
		var fetchPlan = this.evalFetchPlan(options.fetchPlan || "shallow");

		var hClient = new HttpClient();
		var endpoint = "/command/" + this.confData.database.name + "/" + language + "/" + commandText + "/" + limit + "/" + fetchPlan;

		hClient.post({
			endPoint: endpoint
		}, function (error, result) {
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