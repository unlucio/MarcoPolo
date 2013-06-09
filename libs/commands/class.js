"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	getClass: function (className, callback) {
		if (className === null) {
			callback(new Error("Class fetching needs a valid class name"));
		} else {
			var endPoint = "/class/" + this.confData.database.name + "/" + className;

			var hClient = new HttpClient();
			hClient.get(endPoint, callback);
		}
	},
	createClass: function (options, callback) {
		var className = options.className || null;
		var classDefinition = options.definition || null;

		if (className === null || classDefinition === null) {
			if (typeof callback === "function") {
				callback(new Error("Cannot create class, missing className or definition"));
			}
		} else {
			var hClient = new HttpClient();
			var hClient2 = new HttpClient();

			var endpoint = "/class/" + this.confData.database.name + "/" + options.className;
			var endpoint2 = "/property/" + this.confData.database.name + "/" + options.className;
			var classCreateRequest = {
				endPoint: endpoint2,
				data: classDefinition
			};

			hClient.post({endPoint: endpoint}, function (error, result) {
				if (error === null) {
					hClient2.post(classCreateRequest, function (error, result2) {
						if (typeof callback === "function") {
							callback(null, {classID: result});
						}
					});
				}
				else {
					callback(error);
				}
			});
		}
	},
	deleteClass: function (className, callback) {
		if (className === null) {
			callback(new Error("Class deleting needs a valid class name"));
		} else {
			var endPoint = "/class/" + this.confData.database.name + "/" + className;

			var hClient = new HttpClient();
			hClient.delete(endPoint, callback);
		}
	}
};