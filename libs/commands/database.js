"use strict";
var HttpClient = require('../httpClient');

module.exports = {
	getDb: function (callback) {
		var hClient = new HttpClient();
		hClient.get("/database/" + this.confData.database.name, function (error, result) {
			if (typeof callback === 'function') {
				callback(error, result);
			}
		});
	},
	canAccessDb: function (callback) {
		this.getDb(function (error, result) {
			var response = false;

			if (error === null) {
				response = true;
			}

			if (typeof callback === 'function') {
				callback(response);
			}
		});
	},
	createDb: function (options, callback) {
		var dbName = options.name || null;
		var dbStorage = options.storage || "memory";
		var dbType = options.type || "document";

		if (dbName !== null) {
			var hClient = new HttpClient({
				auth: "root:" + this.confData.server.rootPassword
			});

			var requestOptions = {
				endPoint: "/database/" + dbName + "/" + dbStorage + "/" + dbType
			};

			hClient.post(requestOptions, function (error, result) {
				if (typeof callback === "function") {
					callback(error, result);
				}
			});
		} else {
			if (typeof callback === 'function') {
				callback({
					error: "db name cannot be null"
				});
			}
		}
	},
	createIfNotAccess: function (callback) {
		var self = this;

		this.canAccessDb(function (result) {
			if (!result) {
				self.createDb({
					name: self.confData.database.name
				}, function (error, result) {
					if (typeof callback === 'function') {
						if (error === null) {
							callback(true);
						} else {
							callback(false);
						}
					}
				});
			} else {
				callback(true);
			}
		});
	},
	deleteDb: function (callback) {
		var hClient = new HttpClient({
			auth: "root:" + this.confData.server.rootPassword
		});

		hClient.delete("/database/" + this.confData.database.name, function (error, result) {
			if (error === null && typeof result === 'object' && result.result === 1) {
				if (typeof callback === 'function') {
					callback(null, true);
				}
			} else {
				var err = new Error("Cannot delete database (error: " + JSON.stringify(error) + ")");
				if (typeof callback === 'function') {
					callback(err);
				}
			}
		});
	},
};